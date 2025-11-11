/* Payment processing using Stripe Checkout via Ajax and Lambda */

function processPayment(token) {

	// display loading animation ...
	var elem = document.getElementById("loader");
	elem.style.display = "block";
	
    var httpRequest = new XMLHttpRequest();
		
	var data = {
		"token": token.id, 
		"email": token.email,
		"amount": window.price,
		"item": window.item
	};
	
	httpRequest.onreadystatechange = function() {
	    if (httpRequest.readyState === 4) {
	    	if (httpRequest.status === 201) {
                // payment is processed, we can move to the confirmation page
                document.getElementById("loader").style.display = "none";
                
                // TO DO ------------------
                // handle if it's a custom gift
                // and move directly to thanks

                // retrieve id of the payment to update with a message
                var response = JSON.parse(httpRequest.response)
			    var id = response.id;
			    console.log(id);

                // popup to leave a message
                $('#stdMsgId').val(id);
                $('.modal-thanks').show();

            } else {
                // problem while processing payment
                alert("Sorry, there has been a problem with your payment. No amount has been debited. We invite you to make a direct transfer to our account (IBAN : BE37 7350 5282 0528) or to contact us directly: tomxster@gmail.com");
                document.getElementById("loader").style.display = "none";
            }
        }
	};
	
	httpRequest.open('POST', 'https://x97t9hqk1e.execute-api.eu-west-3.amazonaws.com/prod/payment', true);
	httpRequest.setRequestHeader('Content-Type', 'application/json');
	httpRequest.send(JSON.stringify(data));
}

// handle Checkout payment
var handler = StripeCheckout.configure({
	key: 'pk_live_a1RE9seMvw4wYUEs9SiGLl5h',
	image: 'img/portfolio/resized/gift.jpg',
	locale: 'fr',
	token: function(token) {
		processPayment(token);
	}
});

var els = document.getElementsByClassName('paybutton');
Array.prototype.forEach.call(els, function(el) {
	el.addEventListener('click', function(e) {

		// setting global variables
		window.price = 100*$('#customAmount').val();
		item += " : " + $('#customIdea').val();

		if (window.price == 0 || window.item == "") {
			$('.errorMsg').html('Certains champs sont vides');
		}else{
			// display checkout popup
			$('.cmodal-container').hide();
			handler.open({
				name: "Wedding list T&R",
				description: window.item,
				currency: 'eur',
				amount: window.price,
				allowRememberMe: false,
			});
		}
		e.preventDefault();
	});
});

window.addEventListener('popstate', function() {
	handler.close();
});