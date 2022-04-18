// Payment handling on the frontend for the Stripe backend.

//var stripe = Stripe('pk_live_a1RE9seMvw4wYUEs9SiGLl5h');
function displayPayment(button) {
    
    // create a Stripe Checkout session when clicking on "Offrir" button
    var price_id = button.parentElement.parentElement.querySelector('.prix').getAttribute("rel");
    if (price_id == "") {
        var customprice = button.parentElement.parentElement.querySelector('#custom_price').value*100;
        var customtext = button.parentElement.parentElement.querySelector('#custom_text').value;
        var body = { custom_price: customprice, custom_text: customtext };
    }else{
        var body = { priceid: price_id };
    }

    // sending the payment request to our backend, then to Stripe
    fetch('https://mkyxg4hpmk.execute-api.eu-west-1.amazonaws.com/create-checkout-session', { 
        method: "POST",
        body: JSON.stringify(body)
    })
    .then(function(response) { return response.json(); })
    .then(function(session) { return stripe.redirectToCheckout({ sessionId: session.id }); })
    .then(function(result) {
        // if `redirectToCheckout` fails due to a browser or network error
        if (result.error) alert(result.error.message)
    })
    .catch(function(error) { console.error('Error:', error); });
}