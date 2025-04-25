import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpUrlIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const EBS_URL = 'http://lgklsv-cart-api-prod.us-east-1.elasticbeanstalk.com';

export class ApiGatewayEbsProxyStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ebsIntegration = new HttpUrlIntegration(
      'EbsProxyIntegration',
      `${EBS_URL}/{proxy}`,
    );

    const httpApi = new apigwv2.HttpApi(this, 'EbsProxyHttpApi2', {
      apiName: `ebs-proxy-${this.stackName}`,
      description: `Proxy API for Elastic Beanstalk environment: ${EBS_URL}`,
      corsPreflight: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: [
          apigwv2.CorsHttpMethod.OPTIONS,
          apigwv2.CorsHttpMethod.GET,
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.PUT,
          apigwv2.CorsHttpMethod.PATCH,
          apigwv2.CorsHttpMethod.DELETE,
        ],
        allowOrigins: ['*'],
        allowCredentials: false,
      },
    });

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [apigwv2.HttpMethod.ANY],
      integration: ebsIntegration,
    });

    this.apiUrl = httpApi.url;

    new cdk.CfnOutput(this, 'ApiGatewayEndpointUrl', {
      value: this.apiUrl,
      description: 'URL of the API Gateway proxy endpoint',
    });
  }
}
