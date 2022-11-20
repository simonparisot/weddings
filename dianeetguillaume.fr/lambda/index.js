const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {

	console.log("request: " + JSON.stringify(event));
	let price_item = new Object();
	let referer;
	let stripe_account;

	if (event.body && event.body !== "") {
    	//let headers = JSON.parse(event.headers);
    	referer = event.headers.referer;
    	console.log("referer: " + referer);
    	let body = JSON.parse(event.body);
    	stripe_account = body.stripeaccount;
    	console.log("stripe account: " + stripe_account);
	    if (body.priceid && body.priceid !== "") {
	    	// this is a standard product stored in Stripe
	        // var priceid = body.priceid;
	        price_item.price = body.priceid;
	        price_item.quantity = 1;
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
			success_url: referer + "merci.html",
			cancel_url: referer,
		},
  		{stripeAccount: stripe_account}
	);

	let responseBody = { id: session.id };

	let response = {
        statusCode: 200,
        body: JSON.stringify(responseBody)
    };

    console.log("response: " + JSON.stringify(response))
    return response;

}