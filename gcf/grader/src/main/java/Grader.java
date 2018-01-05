/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;
import java.util.function.BinaryOperator;
import org.apache.beam.runners.spark.SparkPipelineOptions;
import org.apache.beam.sdk.Pipeline;
import org.apache.beam.sdk.io.TextIO;
import org.apache.beam.sdk.options.PipelineOptions;
import org.apache.beam.sdk.options.PipelineOptionsFactory;
import org.apache.beam.sdk.transforms.Combine;
import org.apache.beam.sdk.transforms.Combine.CombineFn;
import org.apache.beam.sdk.transforms.DoFn;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;

import org.apache.beam.sdk.transforms.ParDo;
import org.apache.beam.sdk.transforms.View;
import org.apache.beam.sdk.values.PCollectionView;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;

public class Grader {


  static Comparator<String> scoreSorter = new Comparator<String>() {
    @Override
    public int compare(String o1, String o2) {
      int v1 = Integer.parseInt(o1.split(",")[1].trim());
      int v2 = Integer.parseInt(o2.split(",")[1].trim());
      return v2 - v1;
    }
  };

  public static void main(String[] args) {
    PipelineOptionsFactory.register(SparkPipelineOptions.class);
    PipelineOptions options = PipelineOptionsFactory.create();
    // This pipeline can also run with spark or dataflow:
    // options.setRunner(SparkRunner.class);
    // options.setRunner(DataflowRunner.class);
    Pipeline p = Pipeline.create(options);
    //-----------------------

    final PCollectionView<List<String>> testCases = p
        .apply("Read test cases",
            TextIO.read().from("gs://trevoredwards-gcp-workshop/input/test_cases_1"))
        .apply(View.<String>asList());

    p.apply("Read GCF urls", TextIO.read().from("gs://trevoredwards-gcp-workshop/input/gcf_urls"))
        .apply("Run tests", ParDo.of(new DoFn<String, String>() {
          @ProcessElement
          public void processElement(ProcessContext c) throws IOException {
            String gcfUrl = c.element();
            List<String> stringTestCases = c.sideInput(testCases);
            System.out.println(gcfUrl);
            System.out.println(stringTestCases);
            int numberCorrect = 0;
            HttpClient httpclient = HttpClients.createDefault();
            for (String testCase : stringTestCases) {
              String[] splitCase = testCase.split(",");
              String solution = splitCase[splitCase.length - 1];
              HttpPost httppost = new HttpPost(gcfUrl + "/case1");
              ArrayList<NameValuePair> nvps = new ArrayList<>(splitCase.length - 1);
              for (int i = 0; i < splitCase.length - 1; i++) {
                nvps.add(new BasicNameValuePair("" + i, splitCase[i]));
              }

              httppost.setEntity(new UrlEncodedFormEntity(nvps));
              HttpResponse response = httpclient.execute(httppost);
              HttpEntity entity = response.getEntity();
              if (entity != null) {
                InputStream inputStream = entity.getContent();
                try {
                  Scanner s = new Scanner(inputStream).useDelimiter("\\A");
                  String result = s.hasNext() ? s.next() : "";
                  if (result.equals(solution)) {
                    numberCorrect++;
                  } else {
                    System.out.println(
                        String.format("Expected %s but got %s (%s)", solution, result, gcfUrl));
                  }
                } finally {
                  inputStream.close();
                }
              }
            }
            c.output(String.format("%s, %d", gcfUrl, numberCorrect));
          }
        }).withSideInputs(testCases))
        .apply(Combine.globally(new CombineFn<String, ArrayList<String>, String>() {
          @Override
          public ArrayList<String> createAccumulator() {
            return new ArrayList<>();
          }

          @Override
          public ArrayList<String> addInput(ArrayList<String> strings, String s) {
            ArrayList<String> copy = new ArrayList<>(strings);
            copy.add(s);
            copy.sort(scoreSorter);
            return copy;
          }

          @Override
          public ArrayList<String> mergeAccumulators(Iterable<ArrayList<String>> iterable) {
            ArrayList<String> output = new ArrayList<>();
            iterable.forEach(output::addAll);
            output.sort(scoreSorter);
            return output;
          }

          @Override
          public String extractOutput(ArrayList<String> strings) {
            return strings.stream().reduce("", new BinaryOperator<String>() {
              @Override
              public String apply(String str, String acc) {
                return str + "\n" + acc;
              }
            });
          }
        }))
        .apply(TextIO.write().to("gs://trevoredwards-gcp-workshop/output/result"));
    p.run().waitUntilFinish();
  }


}
