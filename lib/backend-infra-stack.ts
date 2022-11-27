import cdk = require('aws-cdk-lib');
import ec2 = require('aws-cdk-lib/aws-ec2');
import ecs = require('aws-cdk-lib/aws-ecs');
import iam = require('aws-cdk-lib/aws-iam');
import s3 = require('aws-cdk-lib/aws-s3');

export class BackendInfraStrack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);


        const executionRole = new iam.Role(this, 'EcsTaskExecutionRole', {
            roleName: 'ecs-crawler-task-execution-role',
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
            managedPolicies: [
              iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
              iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess')
            ],
          });
          

        const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });
        const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
        const taskDef = new ecs.FargateTaskDefinition(this, "MyTaskDefinition", {
            memoryLimitMiB: 512,
            executionRole:executionRole,
            cpu: 256,
          })
        const s3Bucket = s3.Bucket.fromBucketName(this, 'BucketName', 'portofolio-env');

        const containerDef = new ecs.ContainerDefinition(this, "MyContainerDefinition", {
            image: ecs.ContainerImage.fromRegistry("921323820524.dkr.ecr.eu-west-3.amazonaws.com/portofoliotest:latest"),
            taskDefinition: taskDef,
            environmentFiles: [ 
            ecs.EnvironmentFile.fromBucket(s3Bucket, '.env'),
          ],
          });
        containerDef.addPortMappings({
        containerPort: 1337
        });
        new ecs.FargateService(this, "FargateService", {
            assignPublicIp:true,
            cluster,
            taskDefinition: taskDef,
            });
    }


    }
