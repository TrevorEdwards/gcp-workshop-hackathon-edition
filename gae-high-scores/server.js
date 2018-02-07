/**
 * Import the modules we need to use.
 */

const { ATTEMPT_KIND } = require('./constants');
const express = require('express');
const Datastore = require('@google-cloud/datastore');

/**
 * Database connect
 */

const datastore = new Datastore();

/**
 * Server setup
 */

const port = process.env.PORT || 8080;

// Create a server
const app = express();
app.set('view engine', 'pug');

app.get('/', function (request, response) {
  const caseFilter = request.query.case || 0;
  response.render('index', { caseFilter });
});

app.get('/topScores', async function (request, response) {
  try {
    const caseFilter = parseInt(request.query.case || 0);
    const incomingQuery = request.query;
    const query = datastore.createQuery(ATTEMPT_KIND)
      .order('id', { descending: false })
      .order('score', { descending: true })
      .order('timestamp', { descending: false })
      .filter('caseNumber', '=', caseFilter)
      .groupBy('id')
      .limit(incomingQuery.limit || 10) // (A || B) is equivalent to (if (A) { A } else { B })
      .end();
    let [results] = await datastore.runQuery(query);
    // Map results to something more useful to the client.
    results = results.map(function mapResult(result) {
      return {
        id: result.id,
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
