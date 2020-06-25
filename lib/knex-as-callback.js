/**
 *	Knex used to return bluebird promises but changed to using native promises internally due to
 *	adapting async/await with native promises.
 *
 * 	This function bridges that gap and allows projects to slowly migrate their codebase to a promise
 *  one, by converting the native promise knex now returns with to a bluebird one
 */
const Promise = require('bluebird');

function knexAsCallback(knexPromise, callback) {
	if (!knexPromise) return callback(new Error('knexPromise required'));
	const bluebirdPromise = Promise.resolve(knexPromise);
	return bluebirdPromise.asCallback(callback);
}

module.exports = knexAsCallback;