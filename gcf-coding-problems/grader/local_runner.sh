#!/bin/bash
CASE=$1
mvn package -Dexec.mainClass=Grader -Dexec.args="" -Pdirect-runner,dataflow-runner,spark-runner
while true; do
  java -jar target/gcp-workshop-bundled-0.1.jar --caseNumber=${CASE}
  sleep 1
done

