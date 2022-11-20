'use strict';

var AWS = require('aws-sdk'),
ddb = new AWS.DynamoDB.DocumentClient(); 

exports.handler = function(event, context, callback){
    
    // console.log("DEBUG:" + "New request: " + JSON.stringify(event));
    var requestBody = JSON.parse(event.body);
    var item ={};
    item['ok'] = requestBody.ok;
    item['name'] = requestBody.name;
    item['creation-date'] = new Date().toISOString();
    if (requestBody.nb) item['howmany'] = requestBody.nb;
    if (requestBody.address) item['address'] = requestBody.address;


    store().then(() => {

        callback(null, {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
        
    }).catch((err) => {
        
        console.log('ERROR:', JSON.stringify(err));
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
              Error: err.message
            }),
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
        });
        
    });

    function store() {
        console.log("Storing:" + JSON.stringify(item));
        return ddb.put({
            TableName: process.env.TABLE_NAME,
            Item: item,
        }).promise();
    }

};

