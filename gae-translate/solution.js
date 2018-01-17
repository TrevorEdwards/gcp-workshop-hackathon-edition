// Import the "express" module.
const express = require('express');
// Import the Google Cloud Translate library.
const GoogleCloudTranslate = require('@google-cloud/translate');

// Initialize Google Cloud Translate.
const translate = new GoogleCloudTranslate();

function handleRoot(request, response) {
  response.render('index');
}

function handleTranslate(request, response) {
  // Pre-condition: check that we actually received text.
  const query = request.query;
  if (!query.text) {
    response.statusCode = 400; // Bad request
    response.send('Expected text to translate, but didn\'t get any.');
    return;
  }

  // Translate the text. The translation itself it asynchronous because we need
  // to wait for the server to do the translation.
  const textToTranslate = request.query.text;
  const translating = translate.translate(textToTranslate, {
    from: query.from,
    to: query.to
  });

  // Define what we want to do after the translation is done.
  translating.then(function handleTranslatedText([translatedText]) {
    console.log(`Translated: "${textToTranslate}" [${query.from}] -> "${translatedText}" [${query.to}]`);
    response.send(translatedText);
  }).catch(function handleTranslationError(error) {
    response.statusCode = 500; // Server error
    console.error(error.stack);
    response.send(`Server encountered an error: ${error.message}`);
  });
}

// Create a new HTTP web application.
const app = express();
// Configure the view engine.
app.set('view engine', 'pug');
// When someone hits the root path, respond according to handleRoot.
app.get('/', handleRoot);
app.get('/translate', handleTranslate);
// Determine the TCP port number to listen on from the environment, defaulting to 8080.
const PORT = process.env.PORT || 8080;
// Start the web application, listening the port number determined above.
app.listen(PORT);
console.log(`Now listening on port ${PORT}... Press Ctrl+C to quit.`);
