// Import the "express" module.
const express = require('express');

// Declare a function to invoke upon an incoming request.
// "request" is an object that contains information about the incoming request.
// Likewise, "response" contains functions to set the outgoing response.
function handleRequest(request, response) {
  // ignore "request" for now, as we aren't doing anything with it.
  response.send('Hello World!');
}

// Create a new HTTP web application.
const app = express();
// When someone hits the root path, respond according to handleRequest.
app.get('/', handleRequest);
// Determine the TCP port number to listen on from the environment, defaulting to 8080.
const PORT = process.env.PORT || 8080;
// Start the web application, listening the port number determined above.
app.listen(PORT);
console.log(`Now listening on port ${PORT}... Press Ctrl+C to quit.`);

//   https:  // www.google.com  :443  /mail
// └protocol┘  └───hostname───┘└port┘└─path─┘
//
// The port is omitted during normal web browsing usage.
// HTTP defaults to port 80, while HTTPS defaults to port 443.
