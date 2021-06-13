import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";

interface FnStackProps extends cdk.StackProps {
  readonly installPackages?: string;
}

export class FnStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: FnStackProps) {
    super(scope, id, props);

    const fnObjectsBucket = new s3.Bucket(this, "Bucket", {
      // TODO: `bucketName` should be a prop or default/autogen
      bucketName: "fn-objects",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    fnObjectsBucket.addLifecycleRule({ expiration: cdk.Duration.days(1) });

    // NOTE: access key must be made in the console manually
    const fnObjectBucketUser = new iam.User(this, "FnObjectBucketUser", {
      userName: "fn-object-bucket-user",
    });

    fnObjectsBucket.grantReadWrite(fnObjectBucketUser);
  }
}

const app = new cdk.App();

new FnStack(app, "FnStack", {});
app.synth();
