const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {

	console.log("request: " + JSON.stringify(event));
	let price_item = new Object();
	let referer;
	let stripe_account;
	let successUrl;
	let cancelUrl;
	let customerEmail;
	let customerId;

	if (event.body && event.body !== "") {
    	
    	referer = event.headers.referer;
    	let body = JSON.parse(event.body);
    	stripe_account = body.stripeaccount;
    	successUrl = body.successUrl;
    	cancelUrl = body.cancelUrl;
    	body.customerEmail && (customerEmail = body.customerEmail);
    	body.customerId && (customerId = body.customerId);
    	console.log("Payment request from "+referer+" using Stripe account "+stripe_account);

	    if (body.priceid && body.priceid !== "") {
	        // this is a standard product stored in Stripe
	        price_item = {
	            price: body.priceid,
	            quantity: 1,
	        };
	        console.log("ProductId is " + price_item.price);
	    } else {
	        // this is a custom payment
	        price_item = {
	            price_data: {
	                currency: "eur",
	                unit_amount: body.custom_price,
	                product_data: {
	                    name: body.custom_name || "Cadeau personnalisé",
	                    description: body.custom_text,
	                    images: [body.product_img  || "https://audreyetsimon.fr/naissance/img/list/surprise.jpg"],
	                },
	            },
	            quantity: 1,
	        };
	    }
	}

    

	const session = await stripe.checkout.sessions.create(
		{
			payment_method_types: ["card"],
			line_items: [price_item],
			mode: "payment",
			success_url: referer + successUrl,
			cancel_url: referer + cancelUrl,
			...(typeof customerEmail !== 'undefined' && {customer_email: customerEmail}),
			...(typeof customerId !== 'undefined' && {client_reference_id: customerId})
		},
  		{stripeAccount: stripe_account}
	);

	let responseBody = { id: session.id };
    
    console.log(responseBody)
    return generateResponse(201, { id: session.id });

};

function generateResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    };
}