import * as cdk from "@aws-cdk/core";

interface FnStackProps extends cdk.StackProps {
  readonly installPackages?: string;
}

export class FnStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: FnStackProps) {
    super(scope, id, props);
  }
}

const app = new cdk.App();

new FnStack(app, "FnStack", {});
app.synth();
