'use strict';
const Responses = require('../util/response');
const api_create = require('./books/create');
const api_delete = require('./books/delete');
const api_update = require('./books/update');
const api_read = require('./books/read');

module.exports.handler = async (event, context) => {
	try {
		console.log('############ REQUEST #################');
		const data = event.body ? JSON.parse(event.body) : {};
		const method = event.httpMethod;
		const params = event.pathParameters;
		console.log('data', data);
		console.log('method', method);
		console.log('params', params);

		switch (method) {
			case 'POST':
				return await api_create.create(data);
			case 'PUT':
				return await api_update.update(params, data);
			case 'DELETE':
				return await api_delete.delete(params);
			case 'GET':
				if (params) return await api_read.detail(params);
				else return await api_read.list(params);
			default:
				return Responses._404({ message: 'Method not found' });
		}
	} catch (err) {
		console.log('error', err);
		return Responses._500(err);
	}
};
