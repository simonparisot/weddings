exports.handler =  (event, context, callback) => {
    const request = event.Records[0].cf.request;
    // console.log("Request is: " + JSON.stringify(request));
    const headers = request.headers;
    if(request.uri == '/') {
      if (typeof headers['accept-language'] !== 'undefined') {
        const supportedLanguages = headers['accept-language'][0].value;
        console.log('Supported languages:', supportedLanguages);
        if(supportedLanguages.startsWith('fr')){
          console.log("french detected");
          callback(null, redirect('/fr/'));
        } else if(supportedLanguages.startsWith('it')){
          console.log("Italian detected");
          callback(null, redirect('/it/'));
        } else {
          console.log("no language suited. fr it is");
          callback(null, redirect('/fr/')) ;
        }
      } else {
        console.log("No header");
        callback(null, redirect('/fr/'));
      }
    } else {
      callback(null, request);
    }
};

function redirect (to) {
  return {
    status: '301',
    statusDescription: 'redirect to browser language',
    headers: {
      location: [{ key: 'Location', value: to }]
    }
  };
}