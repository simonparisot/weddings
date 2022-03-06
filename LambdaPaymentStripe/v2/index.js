const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {

	console.log("request: " + JSON.stringify(event));

	if (event.body && event.body !== "") {
    	let body = JSON.parse(event.body);
	    if (body.priceid && body.priceid !== "") {
	        var priceid = body.priceid;
	    }
	}

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{price: priceid, quantity: 1},
		],
		mode: "payment",
		success_url: "https://audreyetsimon.fr/naissance/merci.html",
		cancel_url: "https://audreyetsimon.fr/naissance/",
	});

	let responseBody = { id: session.id };

	let response = {
        statusCode: 200,
        body: JSON.stringify(responseBody)
    };

    console.log("response: " + JSON.stringify(response))
    return response;

}