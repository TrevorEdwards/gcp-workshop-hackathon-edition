/**
 * Import the modules we need to use.
 */

const express = require('express');
const GoogleCloudDatastore = require('@google-cloud/datastore');
const common = require('./common');

const PARTICIPANT_KIND = common.PARTICIPANT_KIND;
const ATTEMPT_KIND = common.ATTEMPT_KIND;

/**
 * Database connect
 */

const datastore = new GoogleCloudDatastore();

/**
 * Server setup
 */

const port = process.env.PORT || 8080;

// Create a server
const app = express();
app.set('view engine', 'pug');



app.get('/', function (request, response) {
  response.render('index');
});

app.get('/topScores', async function (request, response) {
  try {
    const incomingQuery = request.query;
    const [participants] = await datastore.runQuery(datastore.createQuery(PARTICIPANT_KIND).end());
    const dict = {};
    for (let i = 0; i < participants.length; i++) {
      dict[participants[i].id] = participants[i];
    }
    const query = datastore.createQuery(ATTEMPT_KIND)
      .order('score', { descending: true })
      .order('timestamp', { descending: false })
      .limit(incomingQuery.limit || 10) // (A || B) is equivalent to (if (A) { A } else { B })
      .end();
    let [results] = await datastore.runQuery(query);
    // Map results to something more useful to the client.
    results = results.map(function mapResult(result) {
      return {
        id: result.id,
        year: dict[result.id].year,
        score: result.score,
        timestamp: result.timestamp
      };
    });
    // Serialize the results as a JSON object and return it.
    response.send(JSON.stringify(results, null, 2));
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.send(e);
  }
});

app.listen(port);
console.log(`Now serving on http://localhost:${port}`);
