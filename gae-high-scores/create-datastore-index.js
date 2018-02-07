const { ATTEMPT_KIND } = require('./constants');
const execa = require('execa');
const fs = require('fs');
const tmp = require('tmp-promise');
const util = require('util');
const yaml = require('js-yaml');

(async () => {
  const writeFileP = util.promisify(fs.writeFile);
  const datastoreIndex = {
    indexes: [{
      kind: ATTEMPT_KIND,
      properties: [
        { name: 'caseNumber' },
        { name: 'id' },
        { name: 'score', direction: 'desc' },
        { name: 'timestamp' }
      ]
    }]
  };
  // create a temporary file and write to it
  const { path } = await tmp.dir();
  const contents = yaml.safeDump(datastoreIndex);
  console.log(`Writing the following to ${path}/index.yaml:`);
  console.log(contents);
  await writeFileP(`${path}/index.yaml`, contents);

  // send index command through gcloud
  const command = `datastore create-indexes ${path}/index.yaml`;
  console.log(`Running "gcloud ${command}"`);
  await execa('gcloud', command.split(' '), { stdio: 'inherit' });
  
  const { stdout } = await execa('gcloud', 'config get-value project'.split(' '));
  console.log(`Success... go to https://console.cloud.google.com/datastore/indexes?project=${stdout.trim()} to see indexing status.`);
})().catch(err => {
  console.error(`An error occurred while indexing datastore. Retrieving top scores may not work. Message: ${err.message}`);
});
