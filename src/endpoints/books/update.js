'use strict';

const dynamo = require('../../util/dynamo');
const response = require('../../util/response');

const DYNAMO_TABLE = process.env.DYNAMO_TABLE || 'books';

/**
 * Update Item with PUT request
 *
 * {
 *  "title" : "updated"
 * }
 *
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 */
module.exports.update = async (param, data) => {
	console.log('update::books', param);
	const key = {
		hashkey: param.hashkey
	};

	const params = {};

	if (data.title) {
		params.title = {
			Action: 'PUT',
			Value: data.title
		};
	}

	if (data.author) {
		params.author = {
			Action: 'PUT',
			Value: data.author
		};
	}

	if (data.price) {
		params.price = {
			Action: 'PUT',
			Value: data.price
		};
	}
	try {
		const success = await dynamo.updateItem(key, params, DYNAMO_TABLE);
		return response._200(success.Attributes);
	} catch (err) {
		return response._500(err);
	}
};
