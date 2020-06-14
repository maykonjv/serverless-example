// 'use strict';

// const dynamo = require('../../../util/dynamo');
// const sqs = require('../../../util/sqs');

// const DYNAMO_TABLE = process.env.DYNAMO_TABLE || 'books';
// const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL || 'book';

// let lastIntervalID;

// /**
//  * This is a Worker example
//  * It's a simple POC to update DynamoDB itens based on hashkey value
//  * stored on SQS Queue
//  * @param {*} event
//  * @param {*} context
//  * @param {*} callback
//  */
// module.exports.worker = (event, context, callback) => {

//     if (lastIntervalID) {
//         clearInterval(lastIntervalID);
//     }

//     //Get records on SQS to update a DynamoDB Table
//     lastIntervalID = setInterval(() => {

//         sqs.consumeQueue(1, SQS_QUEUE_URL)
//             .then(poll => {

//                 console.log("poll", poll);
//                 if (!poll.Messages) {
//                     console.log("return;");
//                     return;
//                 } else {
//                     poll.Messages.forEach(message => {

//                         const item = JSON.parse(message.Body);
//                         console.log("item", item);
//                         //Update item on DynamoDB and remove from Queue
//                         _updateRecord(item.hashkey)
//                             .then(success => sqs.removeFromQueue(message))
//                             .catch(err => console.log("error UpdateRecord", err));

//                     });
//                 }

//         }).catch(err => console.log(err));

//     }, 10000);

// };

// /**
//  * Update flag on DynamoDB Item
//  * @param {*} hashkey
//  */
// const _updateRecord = hashkey => {
//     console.log("updateRecord..")
//     const key = { hashkey: hashkey };
//     const expression = "set updated_by_worker = :flag";

//     const values = {
//         ":flag": 1
//     };

//     return dynamo.update(key, expression, values, DYNAMO_TABLE);
// }
