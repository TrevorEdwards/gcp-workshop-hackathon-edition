#!/bin/bash
while true; do
  RUNNER="Dataflow" mvn exec:java -Dexec.mainClass=Grader -Dexec.args="" -Pdirect-runner,dataflow-runner,spark-runner
  sleep 1
done

