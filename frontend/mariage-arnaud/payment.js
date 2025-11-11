// Payment handling on the frontend for the Stripe backend.

var stripe_account = "acct_1OvMxC2HBTz5QEJO";
var stripe = Stripe('pk_live_51LGBvIFydABlduG3Yx6axMVdv4LQ6DQljmkAxQeZPkZuJSVgMeTJoHc4C26BwpjO15ie3lcXDOzhJHwcLL7r7KfB00b7HtQ4y1', {
//var stripe = Stripe('pk_test_51LGBvIFydABlduG3zSShZpIbNkIUyfJSsbFUEvzwjp7Gp4R4EyAs1w2cYb1vdxlGVbJ36WHjIBF1PhGtKFQWyPwW00KtaMO0be', {
  stripeAccount: stripe_account,
});

function displayPayment(button) {
    
    // create a Stripe Checkout session when clicking on "Offrir" button
    var productprice = button.parentElement.parentElement.querySelector('.product_price');
    var productname = button.parentElement.parentElement.querySelector('.list-text').querySelector('h1').textContent;
    var productdescription = button.parentElement.parentElement.querySelector('.list-text').querySelector('span').textContent;
    var productimg = button.parentElement.parentElement.querySelector('img').src;

    if (productprice) {
        // this is a fixed priced product
        var body = {
            product_img: productimg,
            custom_price: parseInt(productprice.textContent, 10)*100,
            custom_name: productname,
            custom_text: productdescription,
            stripeaccount: stripe_account,
            successUrl: 'merci.html',
            cancelUrl: ''
        };

    }else{
        // this is a custom product
        var customprice = button.parentElement.parentElement.querySelector('#custom_price').value*100;
        var customtext = button.parentElement.parentElement.querySelector('#custom_text').value;
        var body = { 
            product_img: productimg,
            custom_price: customprice,
            custom_name: productname,
            custom_text: customtext,
            stripeaccount: stripe_account,
            successUrl: 'merci.html',
            cancelUrl: ''
        };
    }

    // sending the payment request to our backend, then to Stripe
    fetch('https://7dgldtlbqkzusaqp5z45py27vi0cpodp.lambda-url.eu-west-1.on.aws/', { 
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