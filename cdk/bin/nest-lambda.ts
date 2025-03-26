#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NestLambdaStack } from '../lib/nest-lambda-stack';

const app = new cdk.App();
new NestLambdaStack(app, 'NestLambdaStack', {});
