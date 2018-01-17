#!/bin/bash
NUMBER_OF_CASES=100
I=0
while [[ ${I} -lt ${NUMBER_OF_CASES} ]]; do
  A=$RANDOM
  B=$RANDOM
  C=$((A+B))
  echo "${A},${B},${C}" >> test_cases_1
  I=$((I+1))
done
