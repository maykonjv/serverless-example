'use strict';

const dynamo = require('../../util/dynamo');
const response = require('../../util/response');

const DYNAMO_TABLE_BOOKS = process.env.DYNAMO_TABLE_BOOKS || 'books';

module.exports.delete = (event, context, callback) => {

    const key = { hashkey: event.pathParameters.hashkey };

    dynamo.removeRow(key, DYNAMO_TABLE_BOOKS)
        .then(success => {

            response.json(callback, success, 204);

        }).catch(err => {

            response.json(callback, err, 500);

        });

};
