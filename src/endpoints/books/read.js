'use strict';

const dynamo = require('../../util/dynamo');
const response = require('../../util/response');

const DYNAMO_TABLE = process.env.DYNAMO_TABLE || 'books';

module.exports.list = async (params) => {
	try {
		console.log('list::' + DYNAMO_TABLE);
		const result = await dynamo.scan({}, null, DYNAMO_TABLE);
		return response._200(result.Items);
	} catch (err) {
		return response._500(err);
	}
};

module.exports.detail = async (_params) => {
	console.log('detail::' + DYNAMO_TABLE);
	const params = {
		FilterExpression: '#hashkey = :hashkey',
		ExpressionAttributeNames: {
			'#hashkey': 'hashkey'
		},
		ExpressionAttributeValues: {
			':hashkey': _params.hashkey
		}
	};
	try {
		const book = await dynamo.scan(params, null, DYNAMO_TABLE);

		if (book.Items.length === 0) {
			return response._400('not found');
		} else {
			return response._200(JSON.stringify(book.Items[0]));
		}
	} catch (err) {
		return response._500(JSON.stringify(err));
	}
};
