/**
 * Import the modules we need to use.
 */

// A web server framework.
const express = require('express');
// A convenience plugin for express.
const bodyParser = require('body-parser');
// The Google Cloud Translate library.
const GoogleCloudTranslate = require('@google-cloud/translate');

/**
 * Initialize Google Cloud Translate.
 */

const translate = new GoogleCloudTranslate();

/**
 * Set up the server.
 */

// process.env contains an object with environmental variables.
// In Google App Engine, the environmental variable PORT will automatically
// be set.
const port = process.env.PORT || 8080;

// Create a server
const app = express();
app.use(bodyParser());
app.set('view engine', 'pug');

// Handle an incoming GET request for the root path
app.get('/', function handleRoot(request, response) {
  response.render('index');
});

// Handle an incoming POST request for translate
app.post('/translate', function handleTranslate(request, response) {
  // Pre-condition: check that we actually received text.
  if (!request.body.textToTranslate) {
    response.statusCode = 400; // Bad request
    response.send('Expected text to translate, but didn\'t get any.');
    return;
  }

  // Translate the text. The translation itself it asynchronous because we need
  // to wait for the server to do the translation.
  const textToTranslate = request.body.textToTranslate;
  const translating = translate.translate(textToTranslate, {
    from: 'en',
    to: 'es'
  });

  // Define what we want to do after the translation is done.
  translating.then(function handleTranslatedText([translatedText]) {
    console.log(`Translated: "${textToTranslate}" -> "${translatedText}"`);
    response.send(translatedText);
  }).catch(function handleTranslationError(error) {
    response.statusCode = 500; // Server error
    console.error(error.stack);
    response.send(`Server encountered an error: ${error.message}`);
  });
});

app.listen(port);
console.log(`Now serving on http://localhost:${port}`);
