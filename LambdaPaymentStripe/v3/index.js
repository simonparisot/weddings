const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {

	console.log("request: " + JSON.stringify(event));
	let price_item = new Object();
	let referer;
	let stripe_account;
	let successUrl;
	let cancelUrl;

	if (event.body && event.body !== "") {
    	
    	referer = event.headers.referer;
    	let body = JSON.parse(event.body);
    	stripe_account = body.stripeaccount;
    	successUrl = body.successUrl;
    	cancelUrl = body.cancelUrl;
    	console.log("Payment request from "+referer+" using Stripe account "+stripe_account);

	    if (body.priceid && body.priceid !== "") {
	    	// this is a standard product stored in Stripe
	        // var priceid = body.priceid;
	        price_item.price = body.priceid;
	        price_item.quantity = 1;
	        console.log("ProductId is "+price_item.price);
	    }else{
	    	// this is a custom payment
	    	price_item.price_data = {};
	    	price_item.price_data.currency = "eur";
	    	price_item.price_data.unit_amount = body.custom_price;
	    	price_item.price_data.product_data = {};
	    	price_item.price_data.product_data.name = "Cadeau personnalisé";
	    	price_item.price_data.product_data.description = body.custom_text;
	    	price_item.price_data.product_data.images = ["https://audreyetsimon.fr/naissance/img/list/surprise.jpg"];
	        price_item.quantity = 1;
	    }
	}

	const session = await stripe.checkout.sessions.create(
		{
			payment_method_types: ["card"],
			line_items: [price_item],
			mode: "payment",
			success_url: referer + successUrl,
			cancel_url: referer + cancelUrl,
		},
  		{stripeAccount: stripe_account}
	);

	let responseBody = { id: session.id };

	let response = {
        statusCode: 200,
        body: JSON.stringify(responseBody)
    };

    return response;

}