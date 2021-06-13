import * as AWS from "aws-sdk";

import { defaultConfig } from "./aws";

export namespace FnObjectStore {
  const s3Client = new AWS.S3(defaultConfig);

  const OBJECTS_BUCKET_NAME = process.env.OBJECTS_BUCKET_NAME || "";

  export const get = (key: string): Promise<AWS.S3.Body | null> =>
    s3Client
      .getObject({ Key: key, Bucket: OBJECTS_BUCKET_NAME })
      .promise()
      .then((response) => response.Body || null);

  export const set = (key: string, body: AWS.S3.Body): Promise<any> =>
    s3Client
      .upload({
        Bucket: OBJECTS_BUCKET_NAME,
        Key: key,
        Body: body,
      })
      .promise();

  export const getSignedUrl = (key: string): Promise<string> =>
    s3Client.getSignedUrlPromise("getObject", {
      Bucket: OBJECTS_BUCKET_NAME,
      Key: key,
      Expires: 60,
    });
}
