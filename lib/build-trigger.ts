// import cdk = require('aws-cdk-lib');
// import customResource = require('aws-cdk-lib/custom-resources');
// import { Construct } from 'constructs';

// // TO DO

// export class TriggerBuild extends Construct {
//     constructor(scope: Construct, id: string, props?: cdk.CustomResource) {
//         super(scope, id);
//         const build_trigger = new customResource.AwsCustomResource(this, 'triggerAppBuild', {
//             policy: customResource.AwsCustomResourcePolicy.fromSdkCalls({
//                 resources: customResource.AwsCustomResourcePolicy.ANY_RESOURCE
//             }),
//             onCreate: {
//                 service: 'Amplify',
//                 action: 'startJob',
//                 physicalResourceId: customResource.PhysicalResourceId.of('app-build-trigger'),
//                 parameters: {
//                     appId: amplifyApp.appId,
//                     branchName: 'master',
//                     jobType: 'RELEASE',
//                     jobReason: 'Auto Start build',
//                 }
//             },
//         });
//     }

// }