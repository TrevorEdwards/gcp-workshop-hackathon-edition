/**
 * Responds to any HTTP request that can provide a "name" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.helloName = (req, res) => {
  // Example input: {"name": "Trevor"}
  if (req.body.name === undefined) {
    res.status(400).send('Missing name!'); // This is an error case, as "name" is required.
  } else {
    res.status(200).send('Hello ' + req.body.name);
  }
};

