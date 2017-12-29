#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import argparse
import logging

import apache_beam as beam
from apache_beam.io import ReadFromText
from apache_beam.io import WriteToText
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.options.pipeline_options import SetupOptions


def run_test_cases(elem, **kwargs):
  import requests

  logging.info('Processing URL %s', elem)
  full_url = elem + 'case1'
  logging.info('Full URL %s', full_url)
  test_cases = kwargs['SideInputParam']
  num_correct = 0
  for i, csv_test_case in enumerate(test_cases):
    logging.info('Running case: %d', i)
    test_case = csv_test_case.split(',')
    test_case = [int(e) for e in test_case]
    logging.info(test_case)
    req_data = test_case[:-1]  # Last element is the solution
    r = requests.post(
        full_url, json={'data': test_case},
        timeout=10)  # TODO parameterize by test number
    if r.status_code == requests.codes.ok:
      if str(r.text) == str(test_case[-1]):
        num_correct += 1
      else:
        logging.info('Wanted: %s But found: %s', test_case[-1], r.text)
    else:
      logging.info('Error: %d', r.status_code)
  yield elem, num_correct


def run(argv=None):
  parser = argparse.ArgumentParser()
  parser.add_argument(
      '--gcf_urls_input',
      dest='gcf_input',
      default='gs://trevoredwards-gcp-workshop/input/gcf_urls',
      help='File containing URLs for gcf.')
  parser.add_argument(
      '--test_cases_input',
      dest='test_cases',
      default='gs://trevoredwards-gcp-workshop/input/test_cases_',
      help='File containing test cases.')
  parser.add_argument(
      '--test_number', dest='test_number', default='1', help='test case number')
  parser.add_argument(
      '--output_location',
      dest='output',
      default='gs://trevoredwards-gcp-workshop/output/result',
      help='Directory for output.')
  known_args, pipeline_args = parser.parse_known_args(argv)
  pipeline_args.extend([
      '--runner=DataflowRunner',
      '--project=trev-edwa',
      '--staging_location=gs://trevoredwards-gcp-workshop/staging',
      '--temp_location=gs://trevoredwards-gcp-workshop/temp',
      '--job_name=gcp-workshop-scoring',
  ])

  pipeline_options = PipelineOptions(pipeline_args)
  pipeline_options.view_as(SetupOptions).save_main_session = True
  with beam.Pipeline(options=pipeline_options) as p:
    gcf_urls = p | 'Read gcf urls' >> ReadFromText(known_args.gcf_input)
    test_cases = p | 'Read test cases' >> ReadFromText(
        known_args.test_cases + known_args.test_number)
    run_tests = (
        gcf_urls
        | 'Run Tests' >> (beam.transforms.core.ParDo(
            beam.transforms.core.DoFn.from_callable(run_test_cases),
            SideInputParam=beam.pvalue.AsIter(test_cases)))
        | 'combine' >> beam.transforms.combiners.ToList()
        | WriteToText(known_args.output))


if __name__ == '__main__':
  logging.getLogger().setLevel(logging.INFO)
  run()
