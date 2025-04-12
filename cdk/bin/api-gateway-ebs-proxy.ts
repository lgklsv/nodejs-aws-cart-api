#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ApiGatewayEbsProxyStack } from '../lib/api-gateway-ebs-proxy-stack';

const app = new cdk.App();
new ApiGatewayEbsProxyStack(app, 'ApiGatewayEbsProxyStack', {});
