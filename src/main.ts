import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { nestCsrf } from 'ncsrf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
      "origin": [/(cantarella)+.*\.ru$/],
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
  });
  app.use(cookieParser());
  app.use(nestCsrf());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
