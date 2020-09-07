/* ------ ------ ------ ------ ------ ------
Handle payment and purchase record in database 
------ ------ ------ ------ ------ ------ */

// Prepare Stripe Checkout payment object
// We use a private stripe key for payment. Here, my Stripe account is used (Simon Parisot).
var handler = StripeCheckout.configure({
  key: 'pk_test_hbwOKb2RetfdKpJR28GzEWO7',
  image: 'img/profile.png',
  locale: 'fr',
  token: function(token) {
    processPayment(token);
  }
});



// If browser is too old to support fetch API
if (!window.fetch) {
    // to do..
}



// Display payment modal with associated price and item description
// Triggered when user click on "Offrir" buttons
function displayPayment(button) {
  handler.open({
    name: "Liste de mariage D&G",
    description: button.querySelector('.list-text h1').textContent,
    currency: 'eur',
    amount: 100*(button.querySelector('.prix span').textContent),
    allowRememberMe: false,
  });
}



// Display a custom modal for custom gift before proceeding to payment
// Triggered when user click on the custom gift
function displayCustom(button) {
  console.log("You clicked:", button.innerHTML);
  var customModal = document.querySelectorAll('#custom-gift');
  customModal.style.display = "block";
  // body...
}



// Record transaction details in DB
// Triggered when a transaction is done
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



// Payment processing
// Triggered when user has provided its payment information and wants to checkout
function processPayment(token) {

  // display loader ? to do..
  
  var httpRequest = new XMLHttpRequest();
    
  console.log(token);

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