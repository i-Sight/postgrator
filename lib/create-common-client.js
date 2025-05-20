// aka "universal" client
// here we'll wrap each of the database drivers in a unified interface


var supportedDrivers = ['pg'];

module.exports = function (config) {

    if (supportedDrivers.indexOf(config.driver) === -1) {
        throw new Error("db driver is not supported. Must either be " + supportedDrivers.join(" or ") + ".");
    }

    var knex = require('knex');

    var commonClient = {
        connected: false,
        dbDriver: require('pg'),
        dbConnection: null,
        knex: config.knex,
        schemaTable: config.schemaTable,
        createConnection: function (cb) {
          cb();
        },
        runQuery: function (query, cb) {
          this.knex.raw(query).then(function(resp) {
              cb(null, resp);
          });
        },
        endConnection: function (cb) {
          commonClient.knex.destroy().then(function(){
            cb();
          });
        },
        queries: {
            getCurrentVersion: 'SELECT version FROM ' + config.schemaTable + ' ORDER BY version DESC LIMIT 1',
            checkTable: "",
            makeTable: ""
        }
    };

     if (config.driver === 'pg') {    
        commonClient.dbDriver = require('pg')

        var connectionString = config.connectionString || "tcp://" + config.username + ":" + config.password + "@" + config.host + "/" + config.database;

        commonClient.queries.checkTable = "SELECT * FROM pg_catalog.pg_tables WHERE schemaname = CURRENT_SCHEMA AND tablename = '" + config.schemaTable + "';";
        commonClient.queries.makeTable = "CREATE TABLE " + config.schemaTable + " (version INT PRIMARY KEY, name TEXT DEFAULT '', md5 TEXT DEFAULT ''); INSERT INTO " + config.schemaTable + " (version, name, md5) VALUES (0, '', '');";

        if(!commonClient.knex) {
          commonClient.createConnection = function (cb) {
            commonClient.knex = knex({
              client: 'pg',
              connection: connectionString
            });

            cb();
          };
        }

    } else {
        throw new Error("db driver is not supported. Must either be " + supportedDrivers.join(" or ") + ".");
    }

    return commonClient;

};
