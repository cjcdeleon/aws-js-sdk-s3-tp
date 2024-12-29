// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[s3.JavaScript.buckets.getobjectV3]
import {
  GetObjectCommand,
  NoSuchKey,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { ConfiguredRetryStrategy } from "@smithy/util-retry";

export const getObject = async (bucketName, key) => {
  console.log('inside')
  const client =  new S3Client({
    retryStrategy: new ConfiguredRetryStrategy(
        4, // max attempts.
        (attempt) => 100 + attempt * 1000 // backoff function.
    ),
  });

  try {
    console.log('inside2')
    const response = await client.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: key,
        }),
    );
    console.log('inside3')
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();
    console.log('str', str);
  } catch (caught) {
    console.log('inside fail')
    if (caught instanceof NoSuchKey) {
      console.error(
          `Error from S3 while getting object "${key}" from "${bucketName}". No such key exists.`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
          `Error from S3 while getting object from ${bucketName}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      console.log('generic handler, throw this:', caught)
      throw caught;
    }
  }
}

/**
 * Get a single object from a specified S3 bucket.
 * @param {{ bucketName: string, key: string }}
 */
export const main = async ({ bucketName, key }) => {
  await getObject(bucketName, key);

};
// snippet-end:[s3.JavaScript.buckets.getobjectV3]
