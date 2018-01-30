// Import the Google Cloud Translate module.
var GoogleCloudTranslate = require('@google-cloud/translate');
// Create a new Translate object.
var translate = new GoogleCloudTranslate();
// Specify languages to translate to and from
var options = {
  from: 'en',
  to: 'es'
};
// Translate a sentence
translate.translate('hi!', options, function handleTranslation(err, translation) {
  if (err) { // If there's an error, report it.
    console.error(err);
  } else {
    console.log(translation);
  }
});

// Try this!
// $ node translate.js
