"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const efs = require("@aws-cdk/aws-efs");
const codebuild = require("@aws-cdk/aws-codebuild");
const lambda = require("@aws-cdk/aws-lambda");
const path = require("path");
const core_1 = require("@aws-cdk/core");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const fs_1 = require("fs");
class PianoTransformerInferenceStack extends cdk.Stack {
    constructor(scope, id, props) {
        var _a, _b, _c;
        super(scope, id, props);
        // VPC definition.
        const vpc = new ec2.Vpc(this, "PianoTransformerInferenceVPC", {
            maxAzs: 2,
            natGateways: 1,
        });
        // Security Group definitions.
        const ec2SecurityGroup = new ec2.SecurityGroup(this, "PianoTransformerInferenceEC2SG", {
            vpc,
            securityGroupName: "PianoTransformerInferenceEC2SG",
        });
        const lambdaSecurityGroup = new ec2.SecurityGroup(this, "PianoTransformerInferenceLambdaSG", {
            vpc,
            securityGroupName: "PianoTransformerInferenceLambdaSG",
        });
        const efsSecurityGroup = new ec2.SecurityGroup(this, "PianoTransformerInferenceEFSSG", {
            vpc,
            securityGroupName: "PianoTransformerInferenceEFSSG",
        });
        ec2SecurityGroup.connections.allowTo(efsSecurityGroup, ec2.Port.tcp(2049));
        lambdaSecurityGroup.connections.allowTo(efsSecurityGroup, ec2.Port.tcp(2049));
        // Elastic File System file system.
        // For the purpose of cost saving, provisioned troughput has been kept low.
        const fs = new efs.FileSystem(this, "PianoTransformerInferenceEFS", {
            vpc: vpc,
            securityGroup: efsSecurityGroup,
            throughputMode: efs.ThroughputMode.PROVISIONED,
            provisionedThroughputPerSecond: core_1.Size.mebibytes(10),
            removalPolicy: core_1.RemovalPolicy.DESTROY,
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
        const thingToIgnore = fs_1.readdirSync(rootDirectory)
            .filter((name) => name !== "lambda" && name !== "infer")
            .map((name) => fs_1.lstatSync(path.join(rootDirectory, name)).isDirectory()
            ? `${name}/**/*`
            : name);
        thingToIgnore.push("__pycache__/**/*");
        // Lambda function to execute inference.
        const executeInferenceFunction = new lambda.Function(this, "PianoTransformerInferenceExecuteInference", {
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: "lambda/handle.handle",
            code: lambda.Code.fromAsset(rootDirectory, {
                exclude: thingToIgnore,
            }),
            environment: {
                LD_LIBRARY_PATH: "/mnt/python/bin/lib",
                PIANO_TRANSFORMER_CHECKPOINT_PATH: "/mnt/python/piano-transformer-checkpoints/checkpoints/unconditional_model_16.ckpt",
            },
            vpc,
            vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE }),
            securityGroup: lambdaSecurityGroup,
            timeout: cdk.Duration.minutes(3),
            memorySize: 3008,
            reservedConcurrentExecutions: 10,
            filesystem: lambda.FileSystem.fromEfsAccessPoint(EfsAccessPoint, "/mnt/python"),
        });
        (_a = executeInferenceFunction.role) === null || _a === void 0 ? void 0 : _a.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonElasticFileSystemClientFullAccess"));
        (_b = executeInferenceFunction.role) === null || _b === void 0 ? void 0 : _b.addToPrincipalPolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            resources: ["arn:aws:s3:::jlw-ml-output/*"],
            actions: ["s3:Put*"],
        }));
        // Leveraging on AWS CodeBuild to install Python libraries to EFS.
        const codeBuildProject = new codebuild.Project(this, "PianoTransformerInferenceCodeBuildProject", {
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
                            'echo "Downloading and copying model..."',
                            "mkdir -p $CODEBUILD_EFS1/lambda/piano-transformer-checkpoints",
                            "aws s3api get-object --bucket jlw-models --key magenta_piano_transformer_model_16.tar.gz /tmp/1.tar.gz",
                            "tar zxf /tmp/1.tar.gz -C $CODEBUILD_EFS1/lambda/piano-transformer-checkpoints",
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
                buildImage: codebuild.LinuxBuildImage.fromDockerRegistry("lambci/lambda:build-python3.7"),
                computeType: codebuild.ComputeType.LARGE,
                privileged: true,
            },
            securityGroups: [ec2SecurityGroup],
            subnetSelection: vpc.selectSubnets({
                subnetType: ec2.SubnetType.PRIVATE,
            }),
            timeout: cdk.Duration.minutes(30),
        });
        (_c = codeBuildProject.role) === null || _c === void 0 ? void 0 : _c.addToPrincipalPolicy(new aws_iam_1.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            resources: ["*"],
            actions: ["s3:Get*", "s3:List*"],
        }));
        // Configure EFS for CodeBuild.
        const cfnProject = codeBuildProject.node
            .defaultChild;
        cfnProject.fileSystemLocations = [
            {
                type: "EFS",
                //location: fs.mountTargetsAvailable + ".efs." + cdk.Stack.of(this).region + ".amazonaws.com:/",
                location: fs.fileSystemId +
                    ".efs." +
                    cdk.Stack.of(this).region +
                    ".amazonaws.com:/",
                mountPoint: "/mnt/python",
                identifier: "efs1",
                mountOptions: "nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2",
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
exports.PianoTransformerInferenceStack = PianoTransformerInferenceStack;
const app = new cdk.App();
var props = {
    installPackages: undefined,
    env: {
        region: "us-west-2",
    },
};
new PianoTransformerInferenceStack(app, "PianoTransformerInference", props);
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFzQztBQUN0Qyx3Q0FBeUM7QUFDekMsd0NBQXlDO0FBQ3pDLHdDQUF5QztBQUN6QyxvREFBcUQ7QUFDckQsOENBQStDO0FBQy9DLDZCQUE4QjtBQUM5Qix3Q0FBeUQ7QUFDekQsOENBQTJEO0FBQzNELDJCQUE0QztBQU01QyxNQUFhLDhCQUErQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzNELFlBQ0UsS0FBYyxFQUNkLEVBQVUsRUFDVixLQUEwQzs7UUFFMUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsa0JBQWtCO1FBQ2xCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsOEJBQThCLEVBQUU7WUFDNUQsTUFBTSxFQUFFLENBQUM7WUFDVCxXQUFXLEVBQUUsQ0FBQztTQUNmLENBQUMsQ0FBQztRQUVILDhCQUE4QjtRQUM5QixNQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FDNUMsSUFBSSxFQUNKLGdDQUFnQyxFQUNoQztZQUNFLEdBQUc7WUFDSCxpQkFBaUIsRUFBRSxnQ0FBZ0M7U0FDcEQsQ0FDRixDQUFDO1FBRUYsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQy9DLElBQUksRUFDSixtQ0FBbUMsRUFDbkM7WUFDRSxHQUFHO1lBQ0gsaUJBQWlCLEVBQUUsbUNBQW1DO1NBQ3ZELENBQ0YsQ0FBQztRQUVGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUM1QyxJQUFJLEVBQ0osZ0NBQWdDLEVBQ2hDO1lBQ0UsR0FBRztZQUNILGlCQUFpQixFQUFFLGdDQUFnQztTQUNwRCxDQUNGLENBQUM7UUFFRixnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0UsbUJBQW1CLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FDckMsZ0JBQWdCLEVBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUNuQixDQUFDO1FBRUYsbUNBQW1DO1FBQ25DLDJFQUEyRTtRQUMzRSxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLDhCQUE4QixFQUFFO1lBQ2xFLEdBQUcsRUFBRSxHQUFHO1lBQ1IsYUFBYSxFQUFFLGdCQUFnQjtZQUMvQixjQUFjLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxXQUFXO1lBQzlDLDhCQUE4QixFQUFFLFdBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQ2xELGFBQWEsRUFBRSxvQkFBYSxDQUFDLE9BQU87U0FDckMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtZQUNqRSxVQUFVLEVBQUUsRUFBRTtZQUNkLElBQUksRUFBRSxTQUFTO1lBQ2YsU0FBUyxFQUFFO2dCQUNULEdBQUcsRUFBRSxNQUFNO2dCQUNYLEdBQUcsRUFBRSxNQUFNO2FBQ1o7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFLE1BQU07Z0JBQ2hCLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixXQUFXLEVBQUUsS0FBSzthQUNuQjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWpELHNFQUFzRTtRQUN0RSxpREFBaUQ7UUFDakQsTUFBTSxhQUFhLEdBQUcsZ0JBQVcsQ0FBQyxhQUFhLENBQUM7YUFDN0MsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxPQUFPLENBQUM7YUFDdkQsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FDWixjQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUU7WUFDckQsQ0FBQyxDQUFDLEdBQUcsSUFBSSxPQUFPO1lBQ2hCLENBQUMsQ0FBQyxJQUFJLENBQ1QsQ0FBQztRQUNKLGFBQWEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUV2Qyx3Q0FBd0M7UUFDeEMsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQ2xELElBQUksRUFDSiwyQ0FBMkMsRUFDM0M7WUFDRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLE9BQU8sRUFBRSxzQkFBc0I7WUFDL0IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRTtnQkFDekMsT0FBTyxFQUFFLGFBQWE7YUFDdkIsQ0FBQztZQUNGLFdBQVcsRUFBRTtnQkFDWCxlQUFlLEVBQUUscUJBQXFCO2dCQUN0QyxpQ0FBaUMsRUFDL0IsbUZBQW1GO2FBQ3RGO1lBQ0QsR0FBRztZQUNILFVBQVUsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckUsYUFBYSxFQUFFLG1CQUFtQjtZQUNsQyxPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLDRCQUE0QixFQUFFLEVBQUU7WUFDaEMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQzlDLGNBQWMsRUFDZCxhQUFhLENBQ2Q7U0FDRixDQUNGLENBQUM7UUFDRixNQUFBLHdCQUF3QixDQUFDLElBQUksMENBQUUsZ0JBQWdCLENBQzdDLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQ3hDLHlDQUF5QyxDQUMxQyxFQUNEO1FBRUYsTUFBQSx3QkFBd0IsQ0FBQyxJQUFJLDBDQUFFLG9CQUFvQixDQUNqRCxJQUFJLHlCQUFlLENBQUM7WUFDbEIsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztZQUNwQixTQUFTLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQztZQUMzQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUM7U0FDckIsQ0FBQyxFQUNGO1FBRUYsa0VBQWtFO1FBQ2xFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUM1QyxJQUFJLEVBQ0osMkNBQTJDLEVBQzNDO1lBQ0UsV0FBVyxFQUFFLDJDQUEyQztZQUN4RCxXQUFXLEVBQUUsZ0RBQWdEO1lBQzdELEdBQUc7WUFDSCxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUU7d0JBQ0wsUUFBUSxFQUFFOzRCQUNSLDJCQUEyQjs0QkFDM0Isa0ZBQWtGOzRCQUNsRixzQkFBc0I7NEJBQ3RCLHFCQUFxQjs0QkFDckIsK0JBQStCOzRCQUMvQix5QkFBeUI7NEJBQ3pCLGlFQUFpRTs0QkFDakUsZUFBZTs0QkFFZiw4QkFBOEI7NEJBQzlCLHlFQUF5RTs0QkFDekUsa0NBQWtDOzRCQUNsQyxxQ0FBcUM7NEJBQ3JDLHNCQUFzQjs0QkFDdEIsMEVBQTBFOzRCQUMxRSxZQUFZOzRCQUNaLGNBQWM7NEJBQ2QsT0FBTzs0QkFFUCw4QkFBOEI7NEJBQzlCLG1CQUFtQjs0QkFFbkIseUNBQXlDOzRCQUN6QywrREFBK0Q7NEJBQy9ELHdHQUF3Rzs0QkFDeEcsK0VBQStFOzRCQUUvRSwwQ0FBMEM7NEJBQzFDLGlDQUFpQzs0QkFDakMsbURBQW1EOzRCQUVuRCw2Q0FBNkM7NEJBQzdDLDBOQUEwTjs0QkFFMU4sdUNBQXVDOzRCQUN2Qyw0Q0FBNEM7eUJBQzdDO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQztZQUVGLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FDdEQsK0JBQStCLENBQ2hDO2dCQUNELFdBQVcsRUFBRSxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUs7Z0JBQ3hDLFVBQVUsRUFBRSxJQUFJO2FBQ2pCO1lBQ0QsY0FBYyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7WUFDbEMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUM7Z0JBQ2pDLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE9BQU87YUFDbkMsQ0FBQztZQUNGLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDbEMsQ0FDRixDQUFDO1FBRUYsTUFBQSxnQkFBZ0IsQ0FBQyxJQUFJLDBDQUFFLG9CQUFvQixDQUN6QyxJQUFJLHlCQUFlLENBQUM7WUFDbEIsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztZQUNwQixTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDaEIsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQztTQUNqQyxDQUFDLEVBQ0Y7UUFFRiwrQkFBK0I7UUFDL0IsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsSUFBSTthQUNyQyxZQUFvQyxDQUFDO1FBQ3hDLFVBQVUsQ0FBQyxtQkFBbUIsR0FBRztZQUMvQjtnQkFDRSxJQUFJLEVBQUUsS0FBSztnQkFDWCxnR0FBZ0c7Z0JBQ2hHLFFBQVEsRUFDTixFQUFFLENBQUMsWUFBWTtvQkFDZixPQUFPO29CQUNQLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07b0JBQ3pCLGtCQUFrQjtnQkFDcEIsVUFBVSxFQUFFLGFBQWE7Z0JBQ3pCLFVBQVUsRUFBRSxNQUFNO2dCQUNsQixZQUFZLEVBQ1Ysa0VBQWtFO2FBQ3JFO1NBQ0YsQ0FBQztRQUNGLFVBQVUsQ0FBQyxVQUFVLEdBQUc7WUFDdEIsY0FBYyxFQUFFO2dCQUNkLE1BQU0sRUFBRSxTQUFTO2FBQ2xCO1NBQ0YsQ0FBQztRQUVGLDhDQUE4QztRQUM5QyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXBELCtCQUErQjtRQUMvQixJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQzVDLEtBQUssRUFBRSx3QkFBd0IsQ0FBQyxZQUFZO1NBQzdDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTNPRCx3RUEyT0M7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLEtBQUssR0FBd0M7SUFDL0MsZUFBZSxFQUFFLFNBQVM7SUFDMUIsR0FBRyxFQUFFO1FBQ0gsTUFBTSxFQUFFLFdBQVc7S0FDcEI7Q0FDRixDQUFDO0FBRUYsSUFBSSw4QkFBOEIsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNkayA9IHJlcXVpcmUoXCJAYXdzLWNkay9jb3JlXCIpO1xuaW1wb3J0IGVjMiA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3MtZWMyXCIpO1xuaW1wb3J0IGlhbSA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3MtaWFtXCIpO1xuaW1wb3J0IGVmcyA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3MtZWZzXCIpO1xuaW1wb3J0IGNvZGVidWlsZCA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3MtY29kZWJ1aWxkXCIpO1xuaW1wb3J0IGxhbWJkYSA9IHJlcXVpcmUoXCJAYXdzLWNkay9hd3MtbGFtYmRhXCIpO1xuaW1wb3J0IHBhdGggPSByZXF1aXJlKFwicGF0aFwiKTtcbmltcG9ydCB7IEFybiwgU2l6ZSwgUmVtb3ZhbFBvbGljeSB9IGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgeyBFZmZlY3QsIFBvbGljeVN0YXRlbWVudCB9IGZyb20gXCJAYXdzLWNkay9hd3MtaWFtXCI7XG5pbXBvcnQgeyByZWFkZGlyU3luYywgbHN0YXRTeW5jIH0gZnJvbSBcImZzXCI7XG5cbmludGVyZmFjZSBQaWFub1RyYW5zZm9ybWVySW5mZXJlbmNlU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgaW5zdGFsbFBhY2thZ2VzPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgUGlhbm9UcmFuc2Zvcm1lckluZmVyZW5jZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3IoXG4gICAgc2NvcGU6IGNkay5BcHAsXG4gICAgaWQ6IHN0cmluZyxcbiAgICBwcm9wczogUGlhbm9UcmFuc2Zvcm1lckluZmVyZW5jZVN0YWNrUHJvcHNcbiAgKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBWUEMgZGVmaW5pdGlvbi5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCBcIlBpYW5vVHJhbnNmb3JtZXJJbmZlcmVuY2VWUENcIiwge1xuICAgICAgbWF4QXpzOiAyLFxuICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgfSk7XG5cbiAgICAvLyBTZWN1cml0eSBHcm91cCBkZWZpbml0aW9ucy5cbiAgICBjb25zdCBlYzJTZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKFxuICAgICAgdGhpcyxcbiAgICAgIFwiUGlhbm9UcmFuc2Zvcm1lckluZmVyZW5jZUVDMlNHXCIsXG4gICAgICB7XG4gICAgICAgIHZwYyxcbiAgICAgICAgc2VjdXJpdHlHcm91cE5hbWU6IFwiUGlhbm9UcmFuc2Zvcm1lckluZmVyZW5jZUVDMlNHXCIsXG4gICAgICB9XG4gICAgKTtcblxuICAgIGNvbnN0IGxhbWJkYVNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoXG4gICAgICB0aGlzLFxuICAgICAgXCJQaWFub1RyYW5zZm9ybWVySW5mZXJlbmNlTGFtYmRhU0dcIixcbiAgICAgIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBzZWN1cml0eUdyb3VwTmFtZTogXCJQaWFub1RyYW5zZm9ybWVySW5mZXJlbmNlTGFtYmRhU0dcIixcbiAgICAgIH1cbiAgICApO1xuXG4gICAgY29uc3QgZWZzU2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChcbiAgICAgIHRoaXMsXG4gICAgICBcIlBpYW5vVHJhbnNmb3JtZXJJbmZlcmVuY2VFRlNTR1wiLFxuICAgICAge1xuICAgICAgICB2cGMsXG4gICAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiBcIlBpYW5vVHJhbnNmb3JtZXJJbmZlcmVuY2VFRlNTR1wiLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBlYzJTZWN1cml0eUdyb3VwLmNvbm5lY3Rpb25zLmFsbG93VG8oZWZzU2VjdXJpdHlHcm91cCwgZWMyLlBvcnQudGNwKDIwNDkpKTtcbiAgICBsYW1iZGFTZWN1cml0eUdyb3VwLmNvbm5lY3Rpb25zLmFsbG93VG8oXG4gICAgICBlZnNTZWN1cml0eUdyb3VwLFxuICAgICAgZWMyLlBvcnQudGNwKDIwNDkpXG4gICAgKTtcblxuICAgIC8vIEVsYXN0aWMgRmlsZSBTeXN0ZW0gZmlsZSBzeXN0ZW0uXG4gICAgLy8gRm9yIHRoZSBwdXJwb3NlIG9mIGNvc3Qgc2F2aW5nLCBwcm92aXNpb25lZCB0cm91Z2hwdXQgaGFzIGJlZW4ga2VwdCBsb3cuXG4gICAgY29uc3QgZnMgPSBuZXcgZWZzLkZpbGVTeXN0ZW0odGhpcywgXCJQaWFub1RyYW5zZm9ybWVySW5mZXJlbmNlRUZTXCIsIHtcbiAgICAgIHZwYzogdnBjLFxuICAgICAgc2VjdXJpdHlHcm91cDogZWZzU2VjdXJpdHlHcm91cCxcbiAgICAgIHRocm91Z2hwdXRNb2RlOiBlZnMuVGhyb3VnaHB1dE1vZGUuUFJPVklTSU9ORUQsXG4gICAgICBwcm92aXNpb25lZFRocm91Z2hwdXRQZXJTZWNvbmQ6IFNpemUubWViaWJ5dGVzKDEwKSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICB9KTtcblxuICAgIGNvbnN0IEVmc0FjY2Vzc1BvaW50ID0gbmV3IGVmcy5BY2Nlc3NQb2ludCh0aGlzLCBcIkVmc0FjY2Vzc1BvaW50XCIsIHtcbiAgICAgIGZpbGVTeXN0ZW06IGZzLFxuICAgICAgcGF0aDogXCIvbGFtYmRhXCIsXG4gICAgICBwb3NpeFVzZXI6IHtcbiAgICAgICAgZ2lkOiBcIjEwMDBcIixcbiAgICAgICAgdWlkOiBcIjEwMDBcIixcbiAgICAgIH0sXG4gICAgICBjcmVhdGVBY2w6IHtcbiAgICAgICAgb3duZXJHaWQ6IFwiMTAwMFwiLFxuICAgICAgICBvd25lclVpZDogXCIxMDAwXCIsXG4gICAgICAgIHBlcm1pc3Npb25zOiBcIjc3N1wiLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJvb3REaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uXCIpO1xuXG4gICAgLy8gVE9ETzogZml4IGJ1Zywgc2luY2UgaWYgYSBmaWxlIGV4aXN0cyBpbiByb290IGRpcmVjdG9yeSwgaXQgd2lsbCBiZVxuICAgIC8vIElHTk9SRUQgZXZlbiBpZiBpdCdzIGluIGFuICdhbGxvd2VkIGRpcmVjdG9yeSdcbiAgICBjb25zdCB0aGluZ1RvSWdub3JlID0gcmVhZGRpclN5bmMocm9vdERpcmVjdG9yeSlcbiAgICAgIC5maWx0ZXIoKG5hbWUpID0+IG5hbWUgIT09IFwibGFtYmRhXCIgJiYgbmFtZSAhPT0gXCJpbmZlclwiKVxuICAgICAgLm1hcCgobmFtZSkgPT5cbiAgICAgICAgbHN0YXRTeW5jKHBhdGguam9pbihyb290RGlyZWN0b3J5LCBuYW1lKSkuaXNEaXJlY3RvcnkoKVxuICAgICAgICAgID8gYCR7bmFtZX0vKiovKmBcbiAgICAgICAgICA6IG5hbWVcbiAgICAgICk7XG4gICAgdGhpbmdUb0lnbm9yZS5wdXNoKFwiX19weWNhY2hlX18vKiovKlwiKTtcblxuICAgIC8vIExhbWJkYSBmdW5jdGlvbiB0byBleGVjdXRlIGluZmVyZW5jZS5cbiAgICBjb25zdCBleGVjdXRlSW5mZXJlbmNlRnVuY3Rpb24gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKFxuICAgICAgdGhpcyxcbiAgICAgIFwiUGlhbm9UcmFuc2Zvcm1lckluZmVyZW5jZUV4ZWN1dGVJbmZlcmVuY2VcIixcbiAgICAgIHtcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfNyxcbiAgICAgICAgaGFuZGxlcjogXCJsYW1iZGEvaGFuZGxlLmhhbmRsZVwiLFxuICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocm9vdERpcmVjdG9yeSwge1xuICAgICAgICAgIGV4Y2x1ZGU6IHRoaW5nVG9JZ25vcmUsXG4gICAgICAgIH0pLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIExEX0xJQlJBUllfUEFUSDogXCIvbW50L3B5dGhvbi9iaW4vbGliXCIsXG4gICAgICAgICAgUElBTk9fVFJBTlNGT1JNRVJfQ0hFQ0tQT0lOVF9QQVRIOlxuICAgICAgICAgICAgXCIvbW50L3B5dGhvbi9waWFuby10cmFuc2Zvcm1lci1jaGVja3BvaW50cy9jaGVja3BvaW50cy91bmNvbmRpdGlvbmFsX21vZGVsXzE2LmNrcHRcIixcbiAgICAgICAgfSxcbiAgICAgICAgdnBjLFxuICAgICAgICB2cGNTdWJuZXRzOiB2cGMuc2VsZWN0U3VibmV0cyh7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEUgfSksXG4gICAgICAgIHNlY3VyaXR5R3JvdXA6IGxhbWJkYVNlY3VyaXR5R3JvdXAsXG4gICAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDMpLFxuICAgICAgICBtZW1vcnlTaXplOiAzMDA4LFxuICAgICAgICByZXNlcnZlZENvbmN1cnJlbnRFeGVjdXRpb25zOiAxMCxcbiAgICAgICAgZmlsZXN5c3RlbTogbGFtYmRhLkZpbGVTeXN0ZW0uZnJvbUVmc0FjY2Vzc1BvaW50KFxuICAgICAgICAgIEVmc0FjY2Vzc1BvaW50LFxuICAgICAgICAgIFwiL21udC9weXRob25cIlxuICAgICAgICApLFxuICAgICAgfVxuICAgICk7XG4gICAgZXhlY3V0ZUluZmVyZW5jZUZ1bmN0aW9uLnJvbGU/LmFkZE1hbmFnZWRQb2xpY3koXG4gICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoXG4gICAgICAgIFwiQW1hem9uRWxhc3RpY0ZpbGVTeXN0ZW1DbGllbnRGdWxsQWNjZXNzXCJcbiAgICAgIClcbiAgICApO1xuXG4gICAgZXhlY3V0ZUluZmVyZW5jZUZ1bmN0aW9uLnJvbGU/LmFkZFRvUHJpbmNpcGFsUG9saWN5KFxuICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICByZXNvdXJjZXM6IFtcImFybjphd3M6czM6OjpqbHctbWwtb3V0cHV0LypcIl0sXG4gICAgICAgIGFjdGlvbnM6IFtcInMzOlB1dCpcIl0sXG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBMZXZlcmFnaW5nIG9uIEFXUyBDb2RlQnVpbGQgdG8gaW5zdGFsbCBQeXRob24gbGlicmFyaWVzIHRvIEVGUy5cbiAgICBjb25zdCBjb2RlQnVpbGRQcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KFxuICAgICAgdGhpcyxcbiAgICAgIFwiUGlhbm9UcmFuc2Zvcm1lckluZmVyZW5jZUNvZGVCdWlsZFByb2plY3RcIixcbiAgICAgIHtcbiAgICAgICAgcHJvamVjdE5hbWU6IFwiUGlhbm9UcmFuc2Zvcm1lckluZmVyZW5jZUNvZGVCdWlsZFByb2plY3RcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSW5zdGFsbHMgYmluYXJpZXMgYW5kIFB5dGhvbiBsaWJyYXJpZXMgdG8gRUZTLlwiLFxuICAgICAgICB2cGMsXG4gICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgICAgICB2ZXJzaW9uOiBcIjAuMlwiLFxuICAgICAgICAgIHBoYXNlczoge1xuICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICAnZWNobyBcIkluc3RhbGxpbmcgQVdTIENMSVwiJyxcbiAgICAgICAgICAgICAgICAnY3VybCBcImh0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9hd3MtY2xpL2F3c2NsaS1idW5kbGUuemlwXCIgLW8gXCJhd3NjbGktYnVuZGxlLnppcFwiJyxcbiAgICAgICAgICAgICAgICBcInl1bSBpbnN0YWxsIHVuemlwIC15XCIsXG4gICAgICAgICAgICAgICAgXCJ5dW0gaW5zdGFsbCB3Z2V0IC15XCIsXG4gICAgICAgICAgICAgICAgXCJ5dW0gaW5zdGFsbCBhbHNhLWxpYi1kZXZlbCAteVwiLFxuICAgICAgICAgICAgICAgIFwidW56aXAgYXdzY2xpLWJ1bmRsZS56aXBcIixcbiAgICAgICAgICAgICAgICBcIi4vYXdzY2xpLWJ1bmRsZS9pbnN0YWxsIC1pIC91c3IvbG9jYWwvYXdzIC1iIC91c3IvbG9jYWwvYmluL2F3c1wiLFxuICAgICAgICAgICAgICAgIFwiYXdzIC0tdmVyc2lvblwiLFxuXG4gICAgICAgICAgICAgICAgJ2VjaG8gXCJJbnN0YWxsaW5nIGxpYnNuZGZpbGVcIicsXG4gICAgICAgICAgICAgICAgXCJ3Z2V0IGh0dHA6Ly93d3cubWVnYS1uZXJkLmNvbS9saWJzbmRmaWxlL2ZpbGVzL2xpYnNuZGZpbGUtMS4wLjI4LnRhci5nelwiLFxuICAgICAgICAgICAgICAgIFwidGFyIC14ZiBsaWJzbmRmaWxlLTEuMC4yOC50YXIuZ3pcIixcbiAgICAgICAgICAgICAgICBcIm1rZGlyIC1wICRDT0RFQlVJTERfRUZTMS9sYW1iZGEvYmluXCIsXG4gICAgICAgICAgICAgICAgXCJjZCBsaWJzbmRmaWxlLTEuMC4yOFwiLFxuICAgICAgICAgICAgICAgIFwiLi9jb25maWd1cmUgLS1wcmVmaXg9JENPREVCVUlMRF9FRlMxL2xhbWJkYS9iaW4gLS1kaXNhYmxlLXN0YXRpYyAmJiBtYWtlXCIsXG4gICAgICAgICAgICAgICAgXCJtYWtlIGNoZWNrXCIsXG4gICAgICAgICAgICAgICAgXCJtYWtlIGluc3RhbGxcIixcbiAgICAgICAgICAgICAgICBcImNkIC4uXCIsXG5cbiAgICAgICAgICAgICAgICAnZWNobyBcIlVzaW5nIHB5dGhvbiB2ZXJzaW9uOlwiJyxcbiAgICAgICAgICAgICAgICBcInB5dGhvbjMgLS12ZXJzaW9uXCIsXG5cbiAgICAgICAgICAgICAgICAnZWNobyBcIkRvd25sb2FkaW5nIGFuZCBjb3B5aW5nIG1vZGVsLi4uXCInLFxuICAgICAgICAgICAgICAgIFwibWtkaXIgLXAgJENPREVCVUlMRF9FRlMxL2xhbWJkYS9waWFuby10cmFuc2Zvcm1lci1jaGVja3BvaW50c1wiLFxuICAgICAgICAgICAgICAgIFwiYXdzIHMzYXBpIGdldC1vYmplY3QgLS1idWNrZXQgamx3LW1vZGVscyAtLWtleSBtYWdlbnRhX3BpYW5vX3RyYW5zZm9ybWVyX21vZGVsXzE2LnRhci5neiAvdG1wLzEudGFyLmd6XCIsXG4gICAgICAgICAgICAgICAgXCJ0YXIgenhmIC90bXAvMS50YXIuZ3ogLUMgJENPREVCVUlMRF9FRlMxL2xhbWJkYS9waWFuby10cmFuc2Zvcm1lci1jaGVja3BvaW50c1wiLFxuXG4gICAgICAgICAgICAgICAgJ2VjaG8gXCJJbnN0YWxsaW5nIHZpcnR1YWwgZW52aXJvbm1lbnQuLi5cIicsXG4gICAgICAgICAgICAgICAgXCJta2RpciAtcCAkQ09ERUJVSUxEX0VGUzEvbGFtYmRhXCIsXG4gICAgICAgICAgICAgICAgXCJweXRob24zIC1tIHZlbnYgJENPREVCVUlMRF9FRlMxL2xhbWJkYS90ZW5zb3JmbG93XCIsXG5cbiAgICAgICAgICAgICAgICAnZWNobyBcIkluc3RhbGxpbmcgVGVuc29yZmxvdyBhbmQgTWFnZW50YS4uLlwiJyxcbiAgICAgICAgICAgICAgICBcInNvdXJjZSAkQ09ERUJVSUxEX0VGUzEvbGFtYmRhL3RlbnNvcmZsb3cvYmluL2FjdGl2YXRlICYmIHBpcDMgaW5zdGFsbCB0ZW5zb3JmbG93PT0xLjE0LjAgJiYgcGlwMyBpbnN0YWxsIG1hZ2VudGE9PTEuMy4xICYmIHBpcDMgaW5zdGFsbCBudW1weSAmJiBwaXAzIGluc3RhbGwgdGVuc29yZmxvdy1kYXRhc2V0cz09My4yLjEgJiYgcGlwMyBpbnN0YWxsIHB5ZGFudGljPT0xLjcuM1wiLFxuXG4gICAgICAgICAgICAgICAgJ2VjaG8gXCJDaGFuZ2luZyBmb2xkZXIgcGVybWlzc2lvbnMuLi5cIicsXG4gICAgICAgICAgICAgICAgXCJjaG93biAtUiAxMDAwOjEwMDAgJENPREVCVUlMRF9FRlMxL2xhbWJkYS9cIixcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG5cbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLmZyb21Eb2NrZXJSZWdpc3RyeShcbiAgICAgICAgICAgIFwibGFtYmNpL2xhbWJkYTpidWlsZC1weXRob24zLjdcIlxuICAgICAgICAgICksXG4gICAgICAgICAgY29tcHV0ZVR5cGU6IGNvZGVidWlsZC5Db21wdXRlVHlwZS5MQVJHRSxcbiAgICAgICAgICBwcml2aWxlZ2VkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBzZWN1cml0eUdyb3VwczogW2VjMlNlY3VyaXR5R3JvdXBdLFxuICAgICAgICBzdWJuZXRTZWxlY3Rpb246IHZwYy5zZWxlY3RTdWJuZXRzKHtcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFLFxuICAgICAgICB9KSxcbiAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgICAgfVxuICAgICk7XG5cbiAgICBjb2RlQnVpbGRQcm9qZWN0LnJvbGU/LmFkZFRvUHJpbmNpcGFsUG9saWN5KFxuICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICByZXNvdXJjZXM6IFtcIipcIl0sXG4gICAgICAgIGFjdGlvbnM6IFtcInMzOkdldCpcIiwgXCJzMzpMaXN0KlwiXSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIENvbmZpZ3VyZSBFRlMgZm9yIENvZGVCdWlsZC5cbiAgICBjb25zdCBjZm5Qcm9qZWN0ID0gY29kZUJ1aWxkUHJvamVjdC5ub2RlXG4gICAgICAuZGVmYXVsdENoaWxkIGFzIGNvZGVidWlsZC5DZm5Qcm9qZWN0O1xuICAgIGNmblByb2plY3QuZmlsZVN5c3RlbUxvY2F0aW9ucyA9IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogXCJFRlNcIixcbiAgICAgICAgLy9sb2NhdGlvbjogZnMubW91bnRUYXJnZXRzQXZhaWxhYmxlICsgXCIuZWZzLlwiICsgY2RrLlN0YWNrLm9mKHRoaXMpLnJlZ2lvbiArIFwiLmFtYXpvbmF3cy5jb206L1wiLFxuICAgICAgICBsb2NhdGlvbjpcbiAgICAgICAgICBmcy5maWxlU3lzdGVtSWQgK1xuICAgICAgICAgIFwiLmVmcy5cIiArXG4gICAgICAgICAgY2RrLlN0YWNrLm9mKHRoaXMpLnJlZ2lvbiArXG4gICAgICAgICAgXCIuYW1hem9uYXdzLmNvbTovXCIsXG4gICAgICAgIG1vdW50UG9pbnQ6IFwiL21udC9weXRob25cIixcbiAgICAgICAgaWRlbnRpZmllcjogXCJlZnMxXCIsXG4gICAgICAgIG1vdW50T3B0aW9uczpcbiAgICAgICAgICBcIm5mc3ZlcnM9NC4xLHJzaXplPTEwNDg1NzYsd3NpemU9MTA0ODU3NixoYXJkLHRpbWVvPTYwMCxyZXRyYW5zPTJcIixcbiAgICAgIH0sXG4gICAgXTtcbiAgICBjZm5Qcm9qZWN0LmxvZ3NDb25maWcgPSB7XG4gICAgICBjbG91ZFdhdGNoTG9nczoge1xuICAgICAgICBzdGF0dXM6IFwiRU5BQkxFRFwiLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgLy8gQ3JlYXRlIGRlcGVuZGVuY3QgYmV0d2VlbiBFRlMgYW5kIENvZGVidWlsZFxuICAgIGNvZGVCdWlsZFByb2plY3Qubm9kZS5hZGREZXBlbmRlbmN5KEVmc0FjY2Vzc1BvaW50KTtcblxuICAgIC8vIE91dHB1dCBMYW1iZGEgZnVuY3Rpb24gbmFtZS5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIkxhbWJkYUZ1bmN0aW9uTmFtZVwiLCB7XG4gICAgICB2YWx1ZTogZXhlY3V0ZUluZmVyZW5jZUZ1bmN0aW9uLmZ1bmN0aW9uTmFtZSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG52YXIgcHJvcHM6IFBpYW5vVHJhbnNmb3JtZXJJbmZlcmVuY2VTdGFja1Byb3BzID0ge1xuICBpbnN0YWxsUGFja2FnZXM6IHVuZGVmaW5lZCxcbiAgZW52OiB7XG4gICAgcmVnaW9uOiBcInVzLXdlc3QtMlwiLFxuICB9LFxufTtcblxubmV3IFBpYW5vVHJhbnNmb3JtZXJJbmZlcmVuY2VTdGFjayhhcHAsIFwiUGlhbm9UcmFuc2Zvcm1lckluZmVyZW5jZVwiLCBwcm9wcyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==