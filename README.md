# Google Cloud Platform Workshop

This repository contains workshops as part of a presentation on Google Cloud
Platform. Use this README to follow along with the workshops. Sections will 
be added as we progress through the workshop.

## WORKSHOP: Setting up a project

### Description

In this workshop, you will create a Google Cloud Platform project. A project
organizes all your Google Cloud Platform resources.

### Instructions

1.  Navigate to [Cloud Console](https://console.cloud.google.com).
1.  Sign in with a personal or @cornell.edu account.
1.  If you already have an active Google Cloud Platform trial or credit, skip
    ahead to step 6.
1.  If you have not activated a free trial, you should see the following image:
    ![Free
    Trial](https://github.com/TrevorEdwards/gcp-workshop/blob/master/doc/images/free-trial.png)
    If you would like, you can sign up for this free trial. Doing this will
    require a credit card for identification purposes.
1.  If you cannot or do not wish to activate the free trial, ask a Googler for a
    credit key.
1.  At the [homepage](https://console.cloud.google.com) of GCP, note your
    project id which may be different from your project name. Submit this
    project id (e.g. `cornell-gcp-2018sp-foo-115671`) on
    [this](https://goo.gl/forms/4YF8jiP5kX9r8lNp2) form.

## WORKSHOP: Writing a Cloud Translation Service in Node.js

### Description

This workshop will take you through building a Google Translate-like web service
using the Google Cloud Translate API and Node.js. You'll be able to launch your
app on Google App Engine (GAE) to deploy it to the world!

### Environment

You can choose to run this either in Cloud Shell or on your own machine. If you choose to run on your own machine, follow the additional instructions under "Using your own machine".

If you haven't already, fork this repository first by clicking the button in the top right of this page. Then, clone it with the following command:

```sh
git clone https://github.com/[your-username]/gcp-workshop
```

Navigate to the repository directory:

```sh
cd gcp-workshop
```

Run the following interactive utility to set up billing, API access, and authentication:

```sh
./bin/init-project
```

__NOTE:__ This utility requires Node.js.

If at any time you get stuck, re-run the command and skip the steps you have already done.

Don't worry if you don't completely understand what's happening here -- this is something you would normally do through the web UI. In essence, the script:
1. Creates a new project, which is where your application will live.
1. Links a billing account to the project, which allows you to use Google APIs.
1. Enables the Cloud APIs necessary for this workshop.
1. Creates a service account, which is essentially a Google account for your application, and allows it to access the APIs.
    * As part of this step, you'll download a key which your application will automatically be made aware of. This key is used in lieu of a password for the account.

#### Using your own machine

Before doing the above, you'll need to download [`gcloud`](https://cloud.google.com/sdk/gcloud/) first. As an extra step, you'll need to login with:

```bash
gcloud auth login
```

You will also need to download and install [Node.js 8](https://nodejs.org).

After that, you should be all set to continue as if you were running in the Cloud Shell in the instructions above.

### Install Dependencies

Navigate to the `gae-translate` directory in your terminal:

```sh
cd gae-translate
```

Then, run `npm install` (`npm` is Node's package manager) to install the
dependencies you'll need for this application:

```sh
npm install # This installs dependencies, such as the Google Translate API, as specified by the package.json file in this directory.
```

### Run the server

We've already provided most of the code for you. Start the application by typing the following at the command line:

```sh
node server.js
```

This starts a long-running application that will serve browser requests on port 8080 of the local machine. To see what this looks like, click the "Web Preview" button in the top right of your cloud shell -- which will automatically open up a new tab showing your running web app.

Though barebones, the interface should seem [pretty familiar](https://translate.google.com/). However, there's only two languages in the drop-down menu -- English and Spanish. This is because the server implementation is incomplete. Open up `server.js` and take a look at the code. See if you can fill in the missing part of the code (the part that fetches languages), using the other portions of the code as an example!

_Hint:_ Using your browser's developer console can be helpful for figuring out what exactly is happening under the hood. In Chrome, you can open it by right-clicking anywhere on the web page, clicking, "Inspect", and then changing to the "Sources" or "Network" tab in the console.

### Deploy the application

Once you've filled up the missing part and tinkered around with the code, it's time to deploy the application on Google App Engine. Simply type the following command:

```sh
gcloud app deploy
```

It'll take a few minutes, but in the end you'll see your application deployed to a real production environment!

__Why this works:__ A configuration file named `app.yaml` sits in your working directory. This is the config file used for Google App Engine. It contains just enough information for App Engine to know that you want to use Node.js (`runtime`) on App Engine Flex, the Docker-based version of App Engine (`flex`). See [this page](https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml) for more details.

## WORKSHOP: Google Cloud Functions - Adding Numbers

### Description

In this workshop, you will implement a simple Google Cloud Function that adds
two numbers.

### Instructions

1.  Navigate to your Google Cloud Functions
    [console](https://console.cloud.google.com/functions/list).
1.  Create a new HTTP function called `case1`. Leave all options to their
    defaults.
1.  Replace the existing `index.js` function with this
    [template](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf-coding-problems/problems/1/index_template.js).
1.  Implement the TODOs in `index.js`.
1.  Test your function using the [testing
    tab](https://pantheon.corp.google.com/functions/details/us-central1/case1?&tab=testing)
    with
    [this](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf-coding-problems/problems/1/test_case_1.json)
    test case.
1.  Do more tests as desired. Keep an eye on the scoreboard for your project!
    Feel free to ask for help!

## WORKSHOP: Google Cloud Functions - Translate Similarity

### Description

In this workshop, you will implement a Google Cloud Function which translates a
sentence to a target language and back, then returns the similarity between the
original sentence and its translated version.

### Instructions

1.  Enable the Google Cloud Translation API if you have not already
    [here](https://console.cloud.google.com/apis/api/translate.googleapis.com/overview).
1.  Navigate to your Google Cloud Functions
    [console](https://console.cloud.google.com/functions/list).
1.  Create a new HTTP function called `case2`. Leave all options to their
    defaults.
1.  Replace the existing `index.js` function with this
    [template](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf-coding-problems/problems/2/index_template.js).
1.  Replace the existing `package.json` with this
    [template](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf-coding-problems/problems/2/package_template.json).
1.  Implement all four TODOs in `index.js`.
1.  Test your function using the [testing
    tab](https://console.cloud.google.com/functions/details/us-central1/case2?&tab=testing)
    with
    [this](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf-coding-problems/problems/2/test_case_1.json)
    test case.
1.  Do more tests as desired. Keep an eye on the scoreboard for your project!
    Feel free to ask for help!
