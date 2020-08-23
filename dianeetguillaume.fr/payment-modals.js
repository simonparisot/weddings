// display payment Stripe payment page whenever an "Offrir" button is clicked
function displayPayment(button) {
  console.log("You clicked:", button.innerHTML);
  // body...
}



// display a custom modal for custom gift before proceeding to payment
function displayCustom(button) {
  console.log("You clicked:", button.innerHTML);
  var customModal = document.querySelectorAll('#custom-gift');
  customModal.style.display = "block";
  // body...
}



// add transaction details in DB
function recordTransaction(token, ) {
  var httpRequest = new XMLHttpRequest();
  
  var data = {
    "token": token.id, 
    "email": token.email,
    "amount": 30, // TO DO
    "item": "Lorem", // TO DO
    "msg": "Ipsum dolor sit amet" // TO DO
  };
  console.log(JSON.stringify(data));
  
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
        
      // remove loader, move to thanks modal
      document.querySelector('#loader').style.display = "none";
      document.querySelector('#modal-thanks').style.display = "block";

    }
  };
  
  httpRequest.open('POST', 'https://x97t9hqk1e.execute-api.eu-west-3.amazonaws.com/prod/message', true);
  httpRequest.setRequestHeader('Content-Type', 'application/json');
  httpRequest.send(JSON.stringify(data));
  return false;

}


/*
// Payment processing using Stripe Checkout via Ajax and Lambda
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
                $('.modal-stdItem').show();

            } else {
                // problem while processing payment
                alert("Désolé, il y a eu un problème dans le traitement de votre paiement. Aucune somme n'a été débitée. Nous vons invitons à réessayer ou bien à nous contacter directement : audreyetsimon.p@gmail.com")
                document.getElementById("loader").style.display = "none";
            }
        }
  };
  
  httpRequest.open('POST', 'https://x97t9hqk1e.execute-api.eu-west-3.amazonaws.com/prod/payment', true);
  httpRequest.setRequestHeader('Content-Type', 'application/json');
  httpRequest.send(JSON.stringify(data));
}



// handle Stripe Checkout payment object
var handler = StripeCheckout.configure({
  key: 'pk_live_a1RE9seMvw4wYUEs9SiGLl5h',
  image: 'img/profile.png',
  locale: 'fr',
  token: function(token) {
    processPayment(token);
  }
});

var els = document.getElementsByClassName('paybutton');
Array.prototype.forEach.call(els, function(el) {
  el.addEventListener('click', function(e) {

    // setting global variables
    window.price = 100*$(this).attr('relprice');
    window.item = $(this).attr('reldesc');

    // For some browsers, `attr` is undefined; for others,
    // `attr` is false.  Check for both.
    if (typeof window.item !== typeof undefined && window.item !== false && window.item !== "" && window.item !== 0) {
    }else{
      window.price = 100*$('#customAmount').val();
      window.item = $('#customIdea').val();
    }

    if (window.price == 0 || window.item == "") {
      $('.errorMsg').html('Certains champs sont vides');
    }else{
      // display checkout popup
      $('.cmodal-container').hide();
      handler.open({
        name: "Liste de mariage A&S",
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

*/