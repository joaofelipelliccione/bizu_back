import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.BASE_URL_FRONT,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    credentials: true,
    exposedHeaders: ['*', 'Authorization'],
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
