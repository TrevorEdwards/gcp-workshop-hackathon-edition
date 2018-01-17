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

import static com.google.datastore.v1.client.DatastoreHelper.makeKey;

import com.google.datastore.v1.Entity;
import com.google.datastore.v1.Value;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import org.apache.beam.runners.spark.SparkPipelineOptions;
import org.apache.beam.sdk.Pipeline;
import org.apache.beam.sdk.io.TextIO;
import org.apache.beam.sdk.options.Default.Long;
import org.apache.beam.sdk.options.Description;
import org.apache.beam.sdk.options.PipelineOptionsFactory;
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
import org.apache.beam.sdk.io.gcp.datastore.DatastoreIO;

public class Grader {

  public static void main(String[] args) {
    long timestamp = System.nanoTime();
    PipelineOptionsFactory.register(MyOptions.class);
    MyOptions options = PipelineOptionsFactory.fromArgs(args).as(MyOptions.class);
    // This pipeline can also run with spark or dataflow:
    // options.setRunner(SparkRunner.class);
    // options.setRunner(DataflowRunner.class);
    Pipeline p = Pipeline.create(options);
    long caseNumber = options.getCaseNumber();
    //-----------------------

    final PCollectionView<List<String>> testCases = p
        .apply("Read test cases",
            TextIO.read().from(
                "gs://trevoredwards-gcp-workshop/input/test_cases_" + caseNumber))
        .apply("Collect cases to list", View.<String>asList());

    p.apply("Read GCF urls", TextIO.read().from("gs://trevoredwards-gcp-workshop/input/gcf_urls"))
        .apply("Run tests", ParDo.of(new DoFn<String, Entity>() {
          @ProcessElement
          public void processElement(ProcessContext c) throws IOException {
            String gcfUrl = c.element();
            List<String> stringTestCases = c.sideInput(testCases);
            String exampleBadCase = "";
            long numberCorrect = 0;
            HttpClient httpclient = HttpClients.createDefault();
            for (String testCase : stringTestCases) {
              String[] splitCase = testCase.split(",");
              if (splitCase.length != 3) continue;
              String solution = splitCase[splitCase.length - 1];
              HttpPost httppost = new HttpPost(gcfUrl + "/case" + caseNumber);
              ArrayList<NameValuePair> nvps = new ArrayList<>(splitCase.length - 1);
              if (caseNumber == 1) {
                for (int i = 0; i < splitCase.length - 1; i++) {
                  nvps.add(new BasicNameValuePair("" + i, splitCase[i]));
                }
              } else {
                  nvps.add(new BasicNameValuePair("targetLanguage", splitCase[0]));
                  nvps.add(new BasicNameValuePair("sentence", splitCase[1]));
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
                    exampleBadCase = testCase;
                  }
                } finally {
                  inputStream.close();
                }
              }
            }
            if (!exampleBadCase.isEmpty()) {
              System.out.println(
                  String.format("%s got test cases wrong, including: %s", gcfUrl, exampleBadCase));
            }
            c.output(Entity.newBuilder()
                .setKey(makeKey(makeKey("ScoreEntry", "root").build(), "ScoreEntry",
                    gcfUrl + ":" + timestamp).build())
                .putProperties("id", Value.newBuilder().setStringValue(gcfUrl).build())
                .putProperties("score",
                    Value.newBuilder().setIntegerValue(numberCorrect).build())
                .putProperties("caseNumber",
                    Value.newBuilder().setIntegerValue(caseNumber).build())
                .putProperties("timestamp", Value.newBuilder().setIntegerValue(timestamp).build())
                .build());
          }
        }).withSideInputs(testCases))
        .apply("Write to Datastore", DatastoreIO.v1().write().withProjectId("carrot-cake-139920"));

    p.run().waitUntilFinish();
  }

  interface MyOptions extends SparkPipelineOptions {

    @Description("Case number")
    @Long(1L)
    java.lang.Long getCaseNumber();

    void setCaseNumber(java.lang.Long var1);

  }


}
