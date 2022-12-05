import cdk = require('aws-cdk-lib');
import lambda = require("aws-cdk-lib/aws-lambda");
import aws_lambda_nodejs = require("aws-cdk-lib/aws-lambda-nodejs");

import apigateway = require('aws-cdk-lib/aws-apigatewayv2')
import path =require('path')
export class HelpersInfraStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const lambdaFunction = new lambda.Function(this,'ecs-helper-portofolio',
        {
            memorySize: 1024,
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset(path.join(__dirname, "/../src/lambda")),
            handler: 'index.handler',
        })
        const lambdaURL = new lambda.CfnUrl(this,"url-lambda",{
            targetFunctionArn:lambdaFunction.functionArn,
            authType:lambda.FunctionUrlAuthType.NONE
        })
        const lambdaPermission = new cdk.CfnResource(this, "lambdaPermission", {
            type: "AWS::Lambda::Permission",
            properties: {
              Action: "lambda:InvokeFunctionUrl",
              FunctionName: lambdaFunction.functionArn,
              Principal: "*",
              FunctionUrlAuthType: "NONE",
            },
    })
    }
}
