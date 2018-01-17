const Translate = require('@google-cloud/translate');
const translate = new Translate({
  projectId: process.env.GCLOUD_PROJECT
});


/**
 * Given a request of the form { "targetLanguage": x, "sentence": y}, forms a
 * translation `z` by translating `y` into language `x`, then back to English.
 * Responds with the number of indices which share a common character between 
 * `y` and `z`.
 *
 * For example, if x='jp', y='Hello world!', and z='Hello earth', this function
 * responds with '7'.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.helloWorld = function helloWorld(req, res) {
  if (req.body['targetLanguage'] === undefined || req.body['sentence'] === undefined) {
    res.status(400).send('No data defined!');
  } else {
    // Parse data into variables.
    targetLanguage = req.body['targetLanguage'];
    sentence = req.body['sentence'];
    console.log('Initial request:', sentence, targetLanguage);

    // TODO(1/3): Implement the calculateSimilarity function which takes two strings
    // and returns the number of indices for which they share the same character.
    function calculateSimilarity(phrase1, phrase2) {
      return -1;
    }

    // TODO(2/3): Replace the fake function call below with a call to the
    // Cloud Translation API.
    // HINT: Look at the documentation for the Cloud Translation API Node.js
    // client library:
    // https://cloud.google.com/translate/docs/reference/libraries#client-libraries-usage-nodejs
    replaceThisTextWithTheProperFunctionCall()
      .then(results => {
        console.log(results[0]);
        // TODO(3/3): Replace this text too. Remember to translate back to English.
        // https://cloud.google.com/translate/docs/languages may be helpful.
        replaceThisTextWithTheProperFunctionCall()
          .then(results => {
            const fullTranslation = results[0];
            console.log(fullTranslation);
            res.status(200).send(''+calculateSimilarity(sentence, fullTranslation));
          })
          .catch(err => {
            res.status(500).send(err);
          });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
};

