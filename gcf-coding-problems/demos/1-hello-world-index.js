/**
 *  * Responds to any HTTP request with 'Hello world!'
 *   *
 *    * @param {!Object} req Cloud Function request context.
 *     * @param {!Object} res Cloud Function response context.
 *      */
exports.helloWorld = (req, res) => {
      res.status(200).send('Hello world!'); // Send response with 200 (OK) status.
};

