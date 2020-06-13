'use strict';

const uuid = require('../../util/uuid');
const dynamo = require('../../util/dynamo');
const response = require('../../util/response');

const DYNAMO_TABLE_BOOKS = process.env.DYNAMO_TABLE_BOOKS || 'books';

/**
 * Register a single Book on SQS
 * @param  {[type]}   event    [Event Trigger]
 * @param  {[type]}   context  [Event Context]
 * @param  {Function} callback [Callback to resolve]
 * @return {[type]}            [None]
 *
 * This endpoint receibe a simple POST Payload like this:
 *
 * {
 * 		"title" : "American Gods"
 *      "author" : "Neil Gaiman",
 *      "price" : 10.00
 * }
 *
 * After receibe a simple payload:
 *
 * Register on SQS Queue -> Worker will consume this queue to
 * register Book on DynamoDB Table
 */
module.exports.create = (event, context, callback) => {

    const body = event.body ? event.body : event;
    const data = JSON.parse(body);

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

    /**
     * Save item on DynamoDB and put hashkey on SQS Queue to be
     * updated by example Worker
     */
    Promise.all([
            dynamo.save(book, DYNAMO_TABLE_BOOKS),
            // sqs.sendToQueue({ hashkey: hashkey })
        ])
        .then(success => {
            response.json(callback, success, 201);
        })
        .catch(err => {
            response.json(callback, err, 500);
        });

};
