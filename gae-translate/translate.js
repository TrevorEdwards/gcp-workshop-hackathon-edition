// Import the Google Cloud Translate module.
const GoogleCloudTranslate = require('@google-cloud/translate');
// Create a new Translate object.
const translate = new GoogleCloudTranslate();
// Specify languages to translate to and from
const options = {
  from: 'en',
  to: 'es'
};
// Translate a sentence
translate.translate('hi!', options)
  .then(function handleTranslation(translation) {
    console.log(translation[0]);
  });

// Try this!
// $ node translate.js
