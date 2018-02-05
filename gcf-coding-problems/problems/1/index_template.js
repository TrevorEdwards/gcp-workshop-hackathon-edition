/**
 * Given a request with a body containing
 * {a : int, b : int, operator : string},
 * responds with `a <operator> b`
 *
 * For example: {"a":5, "b":6, operator:"-"}, responds with -1.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.helloWorld = function helloWorld(req, res) {
  if (req.body['a'] === undefined
      || req.body['b'] === undefined
      || req.body['operator'] == undefined) {
    // This is an error case, as "data" is required.
    res.status(400).send('Missing arguments!');
  } else {
    // Parse data into variables a and b.
    a = parseInt(req.body['a']);
    b = parseInt(req.body['b']);
    operator = req.body['operator'];

    // ==== BEGIN IMPLEMENTATION ====
    // TODO: Apply `operator` to a and b and store the result in `result`.

    result = a + b;
    // ==== END IMPLEMENTATION ====
    res.status(200).send('' + result);
  }
};

