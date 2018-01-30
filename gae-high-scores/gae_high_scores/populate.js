const fs = require('fs');
const yaml = require('js-yaml');
const GoogleCloudDatastore = require('@google-cloud/datastore');

const commonYaml = fs.readFileSync('./index.yaml', { encoding: 'utf8' });
const common = yaml.load(commonYaml);
const PARTICIPANT_KIND = common.PARTICIPANT_KIND;
const ATTEMPT_KIND = common.ATTEMPT_KIND;

const datastore = new GoogleCloudDatastore();

const YEARS = ['freshman', 'sophomore', 'junior', 'senior', 'graduate', 'professor'];

const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

async function main() {
  const startTime = Date.now();

  const ids = new Array(256).fill('').map((_, i) => `user${i}`);

  const entries = [];
  for (const id of ids) {
    const yearNum = rand(0, YEARS.length - 1);
    const year = YEARS[yearNum];
    const key = await datastore.key([`${PARTICIPANT_KIND}`, id]);
    const entry = {
      key,
      data: { id, year }
    };
    entries.push(entry);

    const numAttempts = rand(1, 5);
    let timeElapsed = 0;
    for (let i = 0; i < numAttempts; i++) {
      const key = await datastore.key([ENTRY_KIND, `${id}-${i}`]);
      const entry = {
        key,
        data: {
          id,
          timestamp: startTime + timeElapsed,
          score: Math.min(rand(0, 100) + yearNum, 100)
        }
      };
      entries.push(entry);
      timeElapsed += rand(50, 10000);
    }
  }

  for (let i = 0; i < entries.length; i += 500) {
    await datastore.save(entries.slice(i, i + 500));
    console.log(`saved ${Math.min(i + 500, entries.length)}/${entries.length}`);
  }
}

main().catch(console.error);
