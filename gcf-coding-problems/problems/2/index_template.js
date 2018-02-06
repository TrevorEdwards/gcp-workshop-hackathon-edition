/**
 * Given a request with a body containing: {"sequence":[a,b,...]}
 * where sequence is an int array, returns the number of unique index triplets 
 * a,b,c in which sequence[a] < sequence[b] < sequence[c]. 
 * The sequence will always have at least 3 ints.
 *
 * Examples:
 * [1,2,3] => 1 since 1 < 2 < 3
 * [3,2,1] => 0
 * [1,2,3,4] => 3 since 1<2<3, 1<2<4, 1<3<4.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.helloWorld = function helloWorld(req, res) {
  if (req.body['sequence'] === undefined) {
    // This is an error case, as "sequence" is required.
    res.status(400).send('Missing sequence!');
  } else {
    // Turns sequence into ints (grader passes it as string array).
    for (let i = 0; i < req.body['sequence'].length; i++)
      req.body['sequence'][i] = parseInt(req.body['sequence'][i]);
    // ==== BEGIN IMPLEMENTATION ====
    // TODO(1/2): Get sequence from the body and replace the statement below.
    sequence = [1,2,3];

    // TODO(2/2): Calculate the number of triplets and store the result in `result`.

    let result = 0;
    // ==== END IMPLEMENTATION ====
    res.status(200).send('' + result);
  }
};


