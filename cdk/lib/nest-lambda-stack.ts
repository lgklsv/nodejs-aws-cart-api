import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class NestLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nestLambdaFunction = new lambdaNodejs.NodejsFunction(
      this,
      'NestLambda',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler',
        entry: path.join(__dirname, '../../src/lambda.ts'),
        timeout: cdk.Duration.seconds(120),
        bundling: {
          nodeModules: [
            '@codegenie/serverless-express',
            '@nestjs/common',
            '@nestjs/config',
            '@nestjs/core',
            '@nestjs/jwt',
            '@nestjs/passport',
            '@nestjs/platform-express',
            'aws-lambda',
            'helmet',
            'passport',
            'passport-http',
            'passport-jwt',
            'passport-local',
            'reflect-metadata',
            'rxjs',
          ],
        },
      },
    );

    const nestLambdaFunctionUrl = nestLambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
        allowedMethods: [lambda.HttpMethod.ALL],
      },
    });

    new cdk.CfnOutput(this, 'NestLambdaFunctionUrl', {
      value: nestLambdaFunctionUrl.url,
    });
  }
}
