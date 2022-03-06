var stripe = require("stripe")("sk_test_D5VtGyCTQFNbuIRygl3BRkVJ");

var AWS = require('aws-sdk'),
	ddb = new AWS.DynamoDB.DocumentClient();  

exports.handler = async (event, context, callback) => {
    
    console.log('EVENT RECEIVED');
    console.log('DEBUG: Received event:', JSON.stringify(event));
    const requestBody = JSON.parse(event.body);
	const email = requestBody.email;
	const token = requestBody.token;
	const amount = requestBody.amount;
	const item = requestBody.item;
  	const currency = 'eur';

	// try to charge Stripe
	console.log('Charging Stripe...');
    return stripe.charges.create({
		
		amount: amount,
		currency: currency,
		description: 'Mariage A&S : ' + item,
		source: token,
		receipt_email: email

	// then try to update DB for the given login
    }).then(() => {

    	console.log('Stripe charged. Storing item...');
    	//console.log('DEBUG: Charge:', JSON.stringify(charge));
    	store(token, email, amount, item);

    }).then(() => {

	    console.log('Item stored. Returning ...');
	    //console.log('DEBUG: Charge:', JSON.stringify(charge));
	    callback(null, {
	        statusCode: 201,
	        body: JSON.stringify({ id: token }),
	        headers: { 'Access-Control-Allow-Origin': '*' }
	    });
	    
	}).catch((err) => {
	    
	    console.log('ERROR:', JSON.stringify(err));
	    callback(err);
	    
	});
};

function store(t, e, a, i) {
    return ddb.put({
        TableName: process.env.TABLE_NAME,
        Item: {
            token: t,
            email: e,
            RequestTime: new Date().toISOString(),
            amount: a,
            item: i,
        },
    }).promise();
}