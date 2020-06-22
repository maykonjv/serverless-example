'use strict';

const dynamo = require('../../util/dynamo');
const response = require('../../util/response');

const DYNAMO_TABLE = process.env.DYNAMO_TABLE || 'books';

module.exports.delete = async (params) => {
	console.log('delete::' + DYNAMO_TABLE);
	const key = { hashkey: params.hashkey };
	try {
		const success = await dynamo.removeRow(key, DYNAMO_TABLE);
		return response._200(success);
	} catch (err) {
		return response._500(err);
	}
};
