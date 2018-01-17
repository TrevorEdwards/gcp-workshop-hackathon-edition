# Google Cloud Platform Workshop

This repository contains workshops as part of a presentation on Google Cloud Platform. Use this README to follow along with the workshops.

## WORKSHOP: Setting up a project

### Description

In this workshop, you will create a Google Cloud Platform project. A project organizes all your Google Cloud Platform resources.

### Instructions

1. Navigate to [Cloud Console](https://console.cloud.google.com).
1. Sign in with a personal or @cornell.edu account.
1. If you already have an active Google Cloud Platform trial or credit, skip ahead to step 6.
1. If you have not activated a free trial, you should see the following image:
![Free Trial](https://github.com/TrevorEdwards/gcp-workshop/blob/master/create-project/free-trial.png)
If you would like, you can sign up for this free trial. Doing this will require a credit card for identification purposes.
1. If you cannot or do not wish to activate the free trial, ask a Googler for a credit key.
1. Pick a name for your GCP project with the prefix 'gcp-cornell-'. For example, 'gcp-cornell-foo'.
1. Follow the instructions at the top of [this](https://cloud.google.com/resource-manager/docs/creating-managing-projects) page to create a Google Cloud Platform project with the name you picked.
1. At the [homepage](https://console.cloud.google.com) of GCP, note your project id which may be different from your project name. Submit this project id (e.g. 'gcp-cornell-foo-115671') on [this](https://goo.gl/forms/4YF8jiP5kX9r8lNp2) form.

## WORKSHOP: Google Cloud Translate API in Node.js

### Description

TODO

### Instructions

1. TODO

## WORKSHOP: Google Cloud Translate API in Node.js

### Description

TODO

### Instructions

1. TODO

## WORKSHOP: Google Cloud Functions - Adding Numbers

### Description

In this workshop, you will implement a simple Google Cloud Function that adds two numbers.

### Instructions

1. Navigate to your Google Cloud Functions [console](https://console.cloud.google.com/functions/list).
1. Create a new HTTP function called case1. Leave all options to their defaults.
1. Replace the existing function with this [template](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf/problems/1/index_template.js).
1. Implement the TODOs in index.js.
1. Test your function using the [testing tab](https://pantheon.corp.google.com/functions/details/us-central1/case1?&tab=testing) with [this](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf/problems/1/test_case_1.json) test case.
1. Do more tests as desired. Keep an eye on the scoreboard for your project! Feel free to ask for help!

## WORKSHOP: Google Cloud Functions - Translate Similarity

### Description

In this workshop, you will implement a Google Cloud Function which translates a sentence to a target language and back,
then returns the similarity between the original sentence and its translated version.

### Instructions

1. Enable the Google Cloud Translation API if you have not already [here](https://console.cloud.google.com/apis/api/translate.googleapis.com/overview).
1. Navigate to your Google Cloud Functions [console](https://console.cloud.google.com/functions/list).
1. Create a new HTTP function called case2. Leave all options to their defaults.
1. Replace the existing function with this [template](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf/problems/2/index_template.js).
1. Replace the existing package.json with this [template](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf/problems/2/package_template.json).
1. Implement all three TODOs in index.js.
1. Test your function using the [testing tab](https://console.cloud.google.com/functions/details/us-central1/case2?&tab=testing) with [this](https://github.com/TrevorEdwards/gcp-workshop/blob/master/gcf/problems/2/sample_input.json) test case.
1. Do more tests as desired. Keep an eye on the scoreboard for your project! Feel free to ask for help!
