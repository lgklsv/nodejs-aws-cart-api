import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

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
            'cors',
          ],
        },
        environment: {
          DB_HOST: process.env.DB_HOST,
          DB_PORT: process.env.DB_PORT,
          DB_USERNAME: process.env.DB_USERNAME,
          DB_PASSWORD: process.env.DB_PASSWORD,
          DB_NAME: process.env.DB_NAME,
          AUTH_USERNAME: process.env.AUTH_USERNAME,
          AUTH_PASSWORD: process.env.AUTH_PASSWORD,
        },
      },
    );

    const nestLambdaFunctionUrl = nestLambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, 'NestLambdaFunctionUrl', {
      value: nestLambdaFunctionUrl.url,
    });
  }
}
