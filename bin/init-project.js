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
  console.log(chalk.blue(`${indent}*** Checking to see if you already made a project. ***`));
  let project = await gcloud('config get-value project', {}, true);
  console.log(`1. Create a project and set it as the default project.`);
  if (!project || !project.startsWith('cornell-gcp-2018sp-')) {
    console.log(`${indent}Your project ID will be of the form "cornell-gcp-2018sp-(suffix)"`);
    let suffix;
    while (!suffix) {
      console.log(`${indent}Enter a project suffix:`);
      suffix = await ask();
    }
    project = `cornell-gcp-2018sp-${suffix}`;
    console.log(`${indent}Create project "${project}"? [y/n, blank=y]`);
    if (await askYN()) {
      console.log(`${indent}Creating project ${project}...`);
      await gcloud(`projects create ${project}`);
      await gcloud(`config set project ${project}`);
      console.log(`${indent}...done.`);
    } else {
      return;
    }
  } else {
    console.log(`${indent}Using existing project "${project}".`);
  }
  console.log(chalk.green(`${indent}>>> Please fill out this form https://goo.gl/forms/4YF8jiP5kX9r8lNp2 <<<`));
  console.log(chalk.green(`${indent}>>> with your project ID if you haven't already. [press enter]       <<<`));
  await ask();

  console.log(`2. Set up the billing account.`);
  console.log(chalk.blue(`${indent}*** Listing your billing accounts. ***`));
  await gcloud(`beta billing accounts list`);
  console.log(`${indent}The above command listed the billing accounts associated with your account.`);
  console.log(`${indent}If there are none, please follow the instructions in the README to create an account.`);
  console.log(`${indent}Type the ID of the billing account to apply to the project (leave blank to skip):`);
  const billingId = await ask();
  if (billingId) {
    console.log(`${indent}Apply billing account ${billingId} to ${project}? [y/n, blank=y]`);
    if (await askYN()) {
      console.log(chalk.blue(`${indent}*** Applying... ***`));
      await gcloud(`beta billing projects link ${project}`, { 'billing-account': billingId });
      console.log(chalk.blue(`${indent}*** ...done. ***`));
    } else {
      return;
    }
  }

  console.log(`3. Enable Translate and App Engine Flex APIs. [enter to continue]`);
  if (await askYN()) {
    console.log(chalk.blue(`${indent}*** Enabling... ***`));
    await gcloud(`service-management enable translate.googleapis.com`);
    await gcloud(`service-management enable appengineflex.googleapis.com`);
    console.log(chalk.blue(`${indent}*** ...done. ***`));
  } else {
    console.log(chalk.blue(`${indent}*** Skipping... ***`));
  }

  const serviceAccount = 'gcp-workshop-dev';
  console.log(`4. Create a service account. [enter to continue]`);
  if (await askYN()) {
    console.log(chalk.blue(`${indent}*** Creating... ***`));
    await gcloud(`iam service-accounts create ${serviceAccount}`);
    console.log(chalk.blue(`${indent}*** ...done. ***`));
  } else {
    console.log(chalk.blue(`${indent}*** Skipping service account creation... ***`));
  }
  console.log(`${indent}Download service account key? [y/n, blank=y]`);
  if (await askYN()) {
    console.log(chalk.blue(`${indent}*** Downloading service account key... ***`));
    await gcloud(`iam service-accounts keys create key.json`, {
      'iam-account': `${serviceAccount}@${project}.iam.gserviceaccount.com`
    });
    console.log(chalk.blue(`${indent}*** ...done. You're almost there! ***`));
  } else {
    console.log(chalk.blue(`${indent}*** Skipping download... assuming that ${process.cwd()}/key.json exists. ***`));
  }

  console.log(`5. Add your key to the environment`);
  console.log(`${indent}I can't do this through the script, so please run the following command:`);
  console.log(`${indent}${chalk.cyan('$')} ${chalk.red('export')} ${chalk.yellow(`GOOGLE_APPLICATION_CREDENTIALS=${process.cwd()}/key.json`)}`);
  console.log(`${indent}You should re-run this command if you open a new terminal.`);
})().then(() => console.log(`${indent}Exiting!`), console.error);
