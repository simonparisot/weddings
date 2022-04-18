// Save the date form frontend logic

var rsvp = {};
function rsvpNext(nextQuestion, data, value) {
	if (value=="") alert("Pas si vite, il me manque une info !");
	else {
		if (data) rsvp[data]=value;
		if (nextQuestion=='.ok') {
			console.log("Sending to database: " & rsvp);
			
			// sending to backend database
			fetch('https://wsai4xy6qrd6esndf3hqazjdnm0ewmap.lambda-url.eu-west-1.on.aws', { 
                method: "POST",
                body: JSON.stringify(rsvp)
            })
            .then(function(response) { 
            	console.error('success:', response.json());
            })
            .then(function(result) {
                if (result.error) alert(result.error.message)
            })
            .catch(function(error) { 
            	console.error('Error:', error);
            	nextQuestion = '.error';
            });  
		}
		document.querySelector('.currentQuestion').classList.remove("currentQuestion");
		document.querySelector(nextQuestion).classList.add("currentQuestion");
	}
}