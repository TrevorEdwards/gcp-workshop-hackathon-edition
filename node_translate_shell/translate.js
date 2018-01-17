const text = process.argv[2];                                    // process.argv is an array of command line arguments.
const fromLanguage = process.argv[3] || 'en';                    // Default to English if not specified.
const toLanguage = process.argv[4] || 'es';                      // Default to Spanish if not specified.

const GoogleCloudTranslate = require('@google-cloud/translate'); // Import the Google Cloud Translate module.
const translate = new GoogleCloudTranslate();                    // Create a new Translate object.

const options = {
  from: fromLanguage,
  to: toLanguage
};
const translating = translate.translate(text, options);          // Doing a translation in the cloud is an asynchronous task.
                                                                 // So instead of returning the translation itself, the translate
                                                                 // function returns a "Promise" object, which represents a value
                                                                 // that will be known to us in the future.

                                                                 // We don't know this value is yet, but we can decide the code
translating.then(function handleTranslation(translation) {       // that we want to run when we _do_ know.
  console.log(translation[0]);
}).catch(function handleError(error) {
  // Did you set GOOGLE_APPLICATION_CREDENTIALS?
  console.error(error);
});

// Try this!
// $ node translate.js "message to translate" [from language] [to language]
