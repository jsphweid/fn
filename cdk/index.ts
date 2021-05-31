import cdk = require("@aws-cdk/core");
import ec2 = require("@aws-cdk/aws-ec2");
import iam = require("@aws-cdk/aws-iam");
import efs = require("@aws-cdk/aws-efs");
import codebuild = require("@aws-cdk/aws-codebuild");
import lambda = require("@aws-cdk/aws-lambda");
import path = require("path");
import { Size, RemovalPolicy } from "@aws-cdk/core";
import { Effect, PolicyStatement } from "@aws-cdk/aws-iam";
import { readdirSync, lstatSync } from "fs";

interface PianoTransformerInferenceStackProps extends cdk.StackProps {
  readonly installPackages?: string;
}

export class PianoTransformerInferenceStack extends cdk.Stack {
  constructor(
    scope: cdk.App,
    id: string,
    props: PianoTransformerInferenceStackProps
  ) {
    super(scope, id, props);

    // VPC definition.
    const vpc = new ec2.Vpc(this, "PianoTransformerInferenceVPC", {
      maxAzs: 2,
      natGateways: 1,
    });

    // Security Group definitions.
    const ec2SecurityGroup = new ec2.SecurityGroup(
      this,
      "PianoTransformerInferenceEC2SG",
      {
        vpc,
        securityGroupName: "PianoTransformerInferenceEC2SG",
      }
    );

    const lambdaSecurityGroup = new ec2.SecurityGroup(
      this,
      "PianoTransformerInferenceLambdaSG",
      {
        vpc,
        securityGroupName: "PianoTransformerInferenceLambdaSG",
      }
    );

    const efsSecurityGroup = new ec2.SecurityGroup(
      this,
      "PianoTransformerInferenceEFSSG",
      {
        vpc,
        securityGroupName: "PianoTransformerInferenceEFSSG",
      }
    );

    ec2SecurityGroup.connections.allowTo(efsSecurityGroup, ec2.Port.tcp(2049));
    lambdaSecurityGroup.connections.allowTo(
      efsSecurityGroup,
      ec2.Port.tcp(2049)
    );

    // Elastic File System file system.
    // For the purpose of cost saving, provisioned troughput has been kept low.
    const fs = new efs.FileSystem(this, "PianoTransformerInferenceEFS", {
      vpc: vpc,
      securityGroup: efsSecurityGroup,
      throughputMode: efs.ThroughputMode.PROVISIONED,
      provisionedThroughputPerSecond: Size.mebibytes(10),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const EfsAccessPoint = new efs.AccessPoint(this, "EfsAccessPoint", {
      fileSystem: fs,
      path: "/lambda",
      posixUser: {
        gid: "1000",
        uid: "1000",
      },
      createAcl: {
        ownerGid: "1000",
        ownerUid: "1000",
        permissions: "777",
      },
    });

    const rootDirectory = path.join(__dirname, "..");

    // TODO: fix bug, since if a file exists in root directory, it will be
    // IGNORED even if it's in an 'allowed directory'
    const thingToIgnore = readdirSync(rootDirectory)
      .filter((name) => name !== "lambda" && name !== "infer")
      .map((name) =>
        lstatSync(path.join(rootDirectory, name)).isDirectory()
          ? `${name}/**/*`
          : name
      );
    thingToIgnore.push("__pycache__/**/*");

    // Lambda function to execute inference.
    const executeInferenceFunction = new lambda.Function(
      this,
      "PianoTransformerInferenceExecuteInference",
      {
        runtime: lambda.Runtime.PYTHON_3_7,
        handler: "lambda/handle.handle",
        code: lambda.Code.fromAsset(rootDirectory, {
          exclude: thingToIgnore,
        }),
        environment: {
          LD_LIBRARY_PATH: "/mnt/python/bin/lib",
          PIANO_TRANSFORMER_CHECKPOINT_PATH:
            "/mnt/python/piano-transformer-checkpoints/checkpoints/unconditional_model_16.ckpt",
          DRUM_TRANSCRIBER_CHECKPOINT_PATH:
            "/mnt/python/drum-transcriber-checkpoint",
          PIANO_TRANSCRIBER_CHECKPOINT_PATH:
            "/mnt/python/piano-transcriber-checkpoint",
        },
        vpc,
        vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE }),
        securityGroup: lambdaSecurityGroup,
        timeout: cdk.Duration.minutes(3),
        memorySize: 3008,
        reservedConcurrentExecutions: 10,
        filesystem: lambda.FileSystem.fromEfsAccessPoint(
          EfsAccessPoint,
          "/mnt/python"
        ),
      }
    );
    executeInferenceFunction.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonElasticFileSystemClientFullAccess"
      )
    );

    executeInferenceFunction.role?.addToPrincipalPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ["arn:aws:s3:::jlw-ml-output/*"],
        actions: ["s3:Put*"],
      })
    );

    // Leveraging on AWS CodeBuild to install Python libraries to EFS.
    const codeBuildProject = new codebuild.Project(
      this,
      "PianoTransformerInferenceCodeBuildProject",
      {
        projectName: "PianoTransformerInferenceCodeBuildProject",
        description: "Installs binaries and Python libraries to EFS.",
        vpc,
        buildSpec: codebuild.BuildSpec.fromObject({
          version: "0.2",
          phases: {
            build: {
              commands: [
                'echo "Installing AWS CLI"',
                'curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"',
                "yum install unzip -y",
                "yum install wget -y",
                "yum install alsa-lib-devel -y",
                "unzip awscli-bundle.zip",
                "./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws",
                "aws --version",

                'echo "Installing libsndfile"',
                "wget http://www.mega-nerd.com/libsndfile/files/libsndfile-1.0.28.tar.gz",
                "tar -xf libsndfile-1.0.28.tar.gz",
                "mkdir -p $CODEBUILD_EFS1/lambda/bin",
                "cd libsndfile-1.0.28",
                "./configure --prefix=$CODEBUILD_EFS1/lambda/bin --disable-static && make",
                "make check",
                "make install",
                "cd ..",

                'echo "Using python version:"',
                "python3 --version",

                'echo "Downloading and copying model piano transformer model..."',
                "mkdir -p $CODEBUILD_EFS1/lambda/piano-transformer-checkpoints",
                "aws s3api get-object --bucket jlw-models --key magenta_piano_transformer_model_16.tar.gz /tmp/1.tar.gz",
                "tar zxf /tmp/1.tar.gz -C $CODEBUILD_EFS1/lambda/piano-transformer-checkpoints",

                'echo "Downloading and copying drum transcription model..."',
                "mkdir -p $CODEBUILD_EFS1/lambda/drum-transcriber-checkpoint",
                "aws s3api get-object --bucket jlw-models --key drum_transcriber_checkpoint.tar.gz /tmp/2.tar.gz",
                "tar zxf /tmp/2.tar.gz -C $CODEBUILD_EFS1/lambda/drum-transcriber-checkpoint",

                'echo "Downloading and copying piano transcription model..."',
                "mkdir -p $CODEBUILD_EFS1/lambda/piano-transcriber-checkpoint",
                "aws s3api get-object --bucket jlw-models --key piano_transcriber_checkpoint.tar.gz /tmp/3.tar.gz",
                "tar zxf /tmp/3.tar.gz -C $CODEBUILD_EFS1/lambda/piano-transcriber-checkpoint",

                'echo "Installing virtual environment..."',
                "mkdir -p $CODEBUILD_EFS1/lambda",
                "python3 -m venv $CODEBUILD_EFS1/lambda/tensorflow",

                'echo "Installing Tensorflow and Magenta..."',
                "source $CODEBUILD_EFS1/lambda/tensorflow/bin/activate && pip3 install tensorflow==1.14.0 && pip3 install magenta==1.3.1 && pip3 install numpy && pip3 install tensorflow-datasets==3.2.1 && pip3 install pydantic==1.7.3",

                'echo "Changing folder permissions..."',
                "chown -R 1000:1000 $CODEBUILD_EFS1/lambda/",
              ],
            },
          },
        }),

        environment: {
          buildImage: codebuild.LinuxBuildImage.fromDockerRegistry(
            "lambci/lambda:build-python3.7"
          ),
          computeType: codebuild.ComputeType.LARGE,
          privileged: true,
        },
        securityGroups: [ec2SecurityGroup],
        subnetSelection: vpc.selectSubnets({
          subnetType: ec2.SubnetType.PRIVATE,
        }),
        timeout: cdk.Duration.minutes(30),
      }
    );

    codeBuildProject.role?.addToPrincipalPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ["*"],
        actions: ["s3:Get*", "s3:List*"],
      })
    );

    // Configure EFS for CodeBuild.
    const cfnProject = codeBuildProject.node
      .defaultChild as codebuild.CfnProject;
    cfnProject.fileSystemLocations = [
      {
        type: "EFS",
        //location: fs.mountTargetsAvailable + ".efs." + cdk.Stack.of(this).region + ".amazonaws.com:/",
        location:
          fs.fileSystemId +
          ".efs." +
          cdk.Stack.of(this).region +
          ".amazonaws.com:/",
        mountPoint: "/mnt/python",
        identifier: "efs1",
        mountOptions:
          "nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2",
      },
    ];
    cfnProject.logsConfig = {
      cloudWatchLogs: {
        status: "ENABLED",
      },
    };

    // Create dependenct between EFS and Codebuild
    codeBuildProject.node.addDependency(EfsAccessPoint);

    // Output Lambda function name.
    new cdk.CfnOutput(this, "LambdaFunctionName", {
      value: executeInferenceFunction.functionName,
    });
  }
}

const app = new cdk.App();

var props: PianoTransformerInferenceStackProps = {
  installPackages: undefined,
  env: {
    region: "us-west-2",
  },
};

new PianoTransformerInferenceStack(app, "PianoTransformerInference", props);
app.synth();
