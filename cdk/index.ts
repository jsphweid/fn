import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";

interface FnStackProps extends cdk.StackProps {
  readonly installPackages?: string;
}

export class FnStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: FnStackProps) {
    super(scope, id, props);

    new s3.Bucket(this, "Bucket", {
      // TODO: `bucketName` should be a prop or default/autogen
      bucketName: "fn-objects",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
  }
}

const app = new cdk.App();

new FnStack(app, "FnStack", {});
app.synth();
