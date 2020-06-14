'use strict';

const uuid = require('../../util/uuid');
const dynamo = require('../../util/dynamo');
const response = require('../../util/response');

const DYNAMO_TABLE = process.env.DYNAMO_TABLE || 'books';

module.exports.create = async (data) => {
	console.log('create::book');
	const hashkey = uuid();

	const book = {
		hashkey: hashkey,
		title: data.title,
		author: data.author,
		price: data.price,
		updated_by_worker: 0,
		created: new Date().getTime()
	};

	console.log(book);
	try {
		const success = await dynamo.save(book, DYNAMO_TABLE);

		return response._200(success);
	} catch (err) {
		return response._500(err);
	}
};
