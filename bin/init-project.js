const chalk = require('chalk');
const execa = require('execa');
const readline = require('readline');

const indent = '   ';
const gcloud = async (command, options = {}, getStdout = false) => {
  const args = `${command}${Object.keys(options).map(key => ` --${key}=${options[key]}`)}`;
  console.log(`${chalk.cyan('$')} ${chalk.red('gcloud')} ${chalk.yellow(args)}`);
  try {
    if (getStdout) {
      console.log(chalk.blue('------GCLOUD OUTPUT------'));
      const result = await execa('gcloud', args.split(' '), { stdio: [null, null, 'inherit'] });
      console.log(result.stdout);
      console.log(chalk.blue('-------------------------'));
      return result.stdout;
    } else {
      console.log(chalk.blue('------GCLOUD OUTPUT------'));
      await execa('gcloud', args.split(' '), { stdio: 'inherit' });
      console.log(chalk.blue('-------------------------'));
      return '';
    }
  } catch (e) {
    console.log(chalk.blue('-------------------------'));
    throw e;
  }
}

const ask = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const answer = await new Promise(resolve => rl.question(chalk.green(`${indent}> `), resolve));
  rl.close();
  return answer || '';
};

const askYN = async () => {
  const answer = await ask();
  return answer.toUpperCase() === 'Y' || answer.length === 0;
}

(async()=>{
  console.log(`1. Create a project and set it as the default project.`);
  console.log(`${indent}Enter a project suffix (leave blank to skip and use currently set project):`);
  const suffix = await ask();
  let project;
  if (suffix) {
    project = `cornell-gcp-2018sp-${suffix}`;
    console.log(`${indent}Create project ${project}? [y/n, blank=y]`);
    if (await askYN()) {
      console.log(`${indent}Creating project ${project}...`);
      await gcloud(`projects create ${project}`);
      await gcloud(`config set project ${project}`);
      console.log(`${indent}...done.`);
    } else {
      return;
    }
  } else {
    project = await gcloud('config get-value project', {}, true);
    console.log(`${indent}Using project ${project}.`);
  }

  console.log(`2. Set up the billing account.`);
  console.log(`${indent}Showing billing accounts:`);
  await gcloud(`beta billing accounts list`);
  console.log(`${indent}Select the ID of the billing account to apply to the project (leave blank to skip):`);
  const billingId = await ask();
  if (billingId) {
    console.log(`${indent}Apply billing account ${billingID} to ${project}? [y/n, blank=y]`);
    const answer = await ask();
    if (await askYN()) {
      console.log(`${indent}Applying...`);
      await gcloud(`beta billing projects link ${project}`, { 'billing-account': billingId });
      console.log(`${indent}...done.`);
    } else {
      return;
    }
  }

  console.log(`3. Enable necessary APIs.`);
  console.log(`${indent}Enable Translate and App Engine Flex APIs? [y/n, blank=y]`);
  if (await askYN()) {
    console.log(`${indent}Enabling...`);
    await gcloud(`service-management enable translate.googleapis.com`);
    await gcloud(`service-management enable appengineflex.googleapis.com`);
    console.log(`${indent}...done.`);
  } else {
    console.log(`${indent}Skipping...`);
  }

  const serviceAccount = 'gcp-workshop-dev';
  console.log(`4. Get a service account key.`);
  console.log(`${indent}Create service account ${serviceAccount}? [y/n, blank=y]`);
  if (await askYN()) {
    console.log(`${indent}Creating...`);
    await gcloud(`iam service-accounts create ${serviceAccount}`);
    console.log(`${indent}...done`);
  } else {
    console.log(`${indent}Skipping service account creation...`);
  }
  console.log(`${indent}Download service account key? [y/n, blank=y]`);
  if (await askYN()) {
    console.log(`${indent}Downloading service account key...`);
    await gcloud(`iam service-accounts keys create key.json`, {
      'iam-account': `${serviceAccount}@${project}.iam.gserviceaccount.com`
    });
    console.log(`${indent}...done. You're almost there!`);
  } else {
    console.log(`${indent}Skipping download... assuming that ${process.cwd()}/key.json exists.`);
  }

  console.log(`5. Add your key to the environment`);
  console.log(`${indent}I can't do this through the script, so please run the following command:`);
  console.log(`${indent}${chalk.cyan('$')} ${chalk.red('export')} ${chalk.yellow(`GOOGLE_APPLICATION_CREDENTIALS=${process.cwd()}/key.json`)}`);
  console.log(`${indent}You should re-run this command if you open a new terminal.`);
})().then(() => console.log(`${indent}Exiting!`), console.error);
