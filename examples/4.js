const fs = require('fs'); // File System module
const util = require('util'); // Built-in utilities

const promisifiedReadFile = util.promisify(fs.readFile);

const handleSuccess = (contents) => {
  console.log(contents);
};
const handleError = (err) => {
  console.error(err);
};

promisifiedReadFile('4.js', 'utf8')
  .then(handleSuccess)
  .catch(handleError);

promisifiedReadFile('still-nonexistent.js', 'utf8')
  .then(handleSuccess)
  .catch(handleError);
