import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  try {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: err.message,
      }),
    };
  }
};
