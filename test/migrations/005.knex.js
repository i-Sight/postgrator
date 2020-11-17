var asCallback = require('../../lib/knex-as-callback.js');

exports.do = function(knex, done) {
	asCallback(knex('person').insert({name: 'knex', age: 3 }), done);
};

exports.undo = function(knex, done) {
	asCallback(knex('person').where('name', 'knex').del(), done);
};
