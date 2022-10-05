import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://bizudesign.io', 'https://www.bizudesign.io', 'http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    credentials: true,
    exposedHeaders: ['*', 'Authorization'],
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
