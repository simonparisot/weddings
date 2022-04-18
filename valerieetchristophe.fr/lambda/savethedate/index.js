'use strict';

var AWS = require('aws-sdk'),
ddb = new AWS.DynamoDB.DocumentClient(); 

exports.handler = function(event, context, callback){
    
    // console.log("DEBUG:" + "New request: " + JSON.stringify(event));
    var requestBody = JSON.parse(event.body);
    var name = requestBody.name;
    var howmany = requestBody.nb;
    var address = requestBody.address;

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
        return ddb.put({
            TableName: process.env.TABLE_NAME,
            Item: {
                name: name,
                howmany: howmany,
                address: address,
                RequestTime: new Date().toISOString(),
            },
        }).promise();
    }

};

