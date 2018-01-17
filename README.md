# Google Cloud Platform Workshop

This repository contains workshops for Google Cloud Platform.

TODO: Guide to use this repo, overview of directories and links.

## WORKSHOP: Setting up a project

### Description

In this workshop, you will create a Google Cloud Platform project. A project is

For more information, see the Google Cloud Platform
[documentation](https://cloud.google.com/resource-manager/docs/creating-managing-projects).

### Instructions

1. Navigate to [Cloud Console](https://console.cloud.google.com).
1. Sign in and create a free trial account (TODO: Can they use cornell email?). 
   If you already have used your free trial, ask a Googler for GCP
   credits.
1. TODO: the rest of the instructions

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

## WORKSHOP: Google Cloud Functions - Edit Distance

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
