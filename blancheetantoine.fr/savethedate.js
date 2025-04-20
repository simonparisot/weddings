console.log("Hello! if you like this site, you can easily replicate it ;)");
console.log("The github is here: https://github.com/simonparisot/weddings");
console.log("and don't hesitate to ask me for some help: parisot.simon (at) gmail.com");
console.log("------------------------------------------------------------------------------------------");

// Save the date form frontend logic

var rsvp = {};
function rsvpNext(nextQuestion, data, value) {
		
	if (data) {
		if (value !== "" && value !== undefined && value !== null) {
			if (data == "veggyNb" && rsvp["nb"] < value) {
				alert("Pas si vite ! Ça ne colle pas, vous avez dit que vous seriez "+rsvp["nb"]+" à venir.");
				return;
			} else {
				rsvp[data]=value;
			}
		} else {
			alert("Pas si vite ! Il me manque une info.");
			return;
		}
	}

	if (nextQuestion == '.ok' || nextQuestion == '.ko') {
		
		rsvp['ok'] = (nextQuestion == '.ok');
		console.log("Sending to database: " +  JSON.stringify(rsvp));
		
		// sending to backend database
		fetch('https://xhklouywte4wmvvgo4kl7llsmy0kfnrk.lambda-url.eu-west-1.on.aws/', { 
            method: "POST",
            body: JSON.stringify(rsvp)
        })
        .then(function(response) { 
        	if (!response.ok) {
	    		console.log(response);
	    		throw new Error(`Error! status: ${response.status}`);
		    }else{
		    	console.log('Status', response.status, ' --> Response has been stored');
		    }
        })
        .catch(function(error) { 
        	console.error('Error:', error);
        	nextQuestion = '.error';
        });  
	}
	document.querySelector('.currentQuestion').classList.remove("currentQuestion");
	document.querySelector(nextQuestion).classList.add("currentQuestion");
	
}