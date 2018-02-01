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
1.  Follow the instructions at the top of
    [this](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
    page to create a Google Cloud Platform project. Pick a name for your GCP project with the prefix `cornell-gcp-2018sp-`.     For example, `cornell-gcp-2018sp-foo`.
1.  At the [homepage](https://console.cloud.google.com) of GCP, note your
    project id which may be different from your project name. Submit this
    project id (e.g. `cornell-gcp-2018sp-foo-115671`) on
    [this](https://goo.gl/forms/4YF8jiP5kX9r8lNp2) form.

## WORKSHOP: Writing a Cloud Translation Service in Node.js

### Description

This workshop will take you through building a Google Translate-like web service
using the Google Cloud Translate API and Node.js. You'll be able to launch your
app on Google App Engine (GAE) to deploy it to the world!

### Instructions

First off: Enable the Google Cloud Translate API! Click this [link](https://console.cloud.google.com/apis/library/translate.googleapis.com)
to go to the landing page for doing so. Make sure you're signed into your Cornell account (see top-right) and have your project selected, and then click "Enable".

#### Setting up your environment

##### Using Cloud Shell (recommended)

For this workshop you will be using the Cloud Shell, a virtual machine that you can access directly in your browser. To open Cloud Shell, go to the [Cloud Console](https://console.cloud.google.com) and click on
the leftmost button in the top right corner. A bash terminal should open up at the bottom.

Every Google service normally requires you to authenticate using a Google account. For your applications, you can do so with a __service account__, which is a special Google account that associated with a machine rather than a person. To find out the service account that was created by default when you started your project, type the following in the terminal:

```bash
gcloud iam service-accounts list
```

You should see a single e-mail address, which looks like `cornell-gcp-2018-sp-[your project suffix]@appspot.gserviceaccount.com`. This is your service account e-mail.

This service account is activated by default in Google App Engine, but for the Cloud Shell (or your own computer) you'll have to create and download the secret key (to authenticate in lieu of a password) to ensure that you have access to Cloud APIs. To do so, copy the e-mail address that you saw above, and type it as part of the following command:

```bash
gcloud iam service-accounts keys create ~/my-key.json --iam-account=[your service account e-mail]
```

This should create a file called `my-key.json` in your home directory.

Finally, you'll need to make sure any apps your run on this machine knows where the key is. By default, all Google Cloud libraries will use the environmental variable `GOOGLE_APPLICATION_CREDENTIALS` to look for it. Set it to the location of your key as follows:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=~/my-key.json
```

Note that if you close your terminal by accident, you might need to re-do the last command (`export (...)`) again.

You've now configured your machine to work with Google Cloud!

##### Using your own machine

You can do all of the above with your own computer. You'll need to download [`gcloud`](https://cloud.google.com/sdk/gcloud/) first. As an extra step, you'll need to login with:

```bash
gcloud auth login
```

After that, you should be all set to continue as if you were running in the Cloud Shell in the instructions above.

#### Install Dependencies

If you haven't already, fork this repository first by clicking the button in the top right of this page. Then, clone it in the cloud shell (and optionally, your local machine) with the following command:

```
git clone https://github.com/[your-username]/gcp-workshop
```

Next, navigate to the `gae-translate` directory in your terminal:

```sh
cd gcp-workshop/gae-translate
```

Finally, run `npm install` (`npm` is Node's package manager) to install the
dependencies you'll need for this application:

```sh
npm install # This installs dependencies, such as the Google Translate API, as specified by the package.json file in this directory.
```

#### Run the server

We've already provided most of the code for you. Start the application by typing the following at the command line:

```sh
node server.js
```

This starts a long-running application that will serve browser requests on port 8080 of the local machine. To see what this looks like, click the "Web Preview" button in the top right of your cloud shell -- which will automatically open up a new tab showing your running web app.

Though barebones, the interface should seem pretty familiar. However, there's only two languages in the drop-down menu -- English and Spanish. This is because the server is incomplete. Open up `server.js` and take a look at the code. See if you can fill in the missing part of the code (the part that fetches languages), using the other portions of the code as an example!

#### Deploy the application

Once you've filled up the missing part and tinkered around with the code, it's time to deploy the application on Google App Engine. Simply type the following command:

```sh
gcloud app deploy
```

It'll take a few minutes, but in the end you'll see your application deployed to a real production environment!

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
1.  Implement all three TODOs in `index.js`.
1.  Test your function using the [testing
    tab](https://console.cloud.google.com/functions/details/us-central1/case2?&tab=testing)
    with
    [this](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf-coding-problems/problems/2/test_case_1.json)
    test case.
1.  Do more tests as desired. Keep an eye on the scoreboard for your project!
    Feel free to ask for help!
