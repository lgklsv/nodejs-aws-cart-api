import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import helmet from 'helmet';
import cors from 'cors';

import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  app.use(cors());
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
    return await server(event, context, callback);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
