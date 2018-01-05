#!/bin/bash
gsutil cp grader/out/artifacts/grader_jar/grader.jar gs://dataproc-02ea5fcb-ec1f-4baf-96c8-166f62d25ac6-us/grader.jar
while true; do
  gcloud dataproc jobs submit spark --cluster=gcp-grader --jars=gs://dataproc-02ea5fcb-ec1f-4baf-96c8-166f62d25ac6-us/grader.jar --class Grader 
done

