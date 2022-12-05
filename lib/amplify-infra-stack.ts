import * as cdk from "aws-cdk-lib";
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Construct } from "constructs";

export class AmplifyInfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      const amplifyApp = new amplify.App(this, 'MyApp', {   
        sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
          owner: 'BogdanDraghia',
          repository: 'personal-portofolio-frontend',
          oauthToken: cdk.SecretValue.secretsManager('githubaccess'),
        }),
        
        buildSpec: codebuild.BuildSpec.fromObjectToYaml({
            version: 1,
            frontend: {
              phases: {
                preBuild: {
                  commands: [
                    "npm ci"
                  ]
                },
                build: {
                  commands: [
                    "npm run export"
                  ]
                }
              },
              artifacts: {
                baseDirectory: "out",
                files: [
                  "**/*"
                ]
              },
              cache: {
                paths: [
                  "node_modules/**/*"
                ]
              }
          }})
      });
      const proBranch = amplifyApp.addBranch("PRO");
      const domain = amplifyApp.addDomain("bogdandraghia.com");
      domain.mapRoot(proBranch);
      domain.mapSubDomain(proBranch, 'www');
    }
  }