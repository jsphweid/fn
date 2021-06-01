import * as AWS from "aws-sdk";

export namespace FnObjectStore {
  const s3Client = new AWS.S3();

  const S3_OBJECTS_BUCKET_NAME = process.env.S3_OBJECTS_BUCKET_NAME || "";

  export const get = (key: string): Promise<AWS.S3.Body | null> =>
    s3Client
      .getObject({ Key: key, Bucket: S3_OBJECTS_BUCKET_NAME })
      .promise()
      .then((response) => response.Body || null);

  export const set = (key: string, body: AWS.S3.Body): Promise<any> =>
    s3Client
      .upload({
        Bucket: S3_OBJECTS_BUCKET_NAME,
        Key: key,
        Body: body,
      })
      .promise();

  export const getSignedUrl = (key: string): Promise<string> =>
    s3Client.getSignedUrlPromise("getObject", {
      Bucket: S3_OBJECTS_BUCKET_NAME,
      Key: key,
      Expires: 60,
    });
}
