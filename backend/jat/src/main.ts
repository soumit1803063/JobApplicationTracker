import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strip properties not declared in the DTO
      forbidNonWhitelisted: true, // ...and return 400 if any were sent
      transform: true,            // convert payloads to DTO class instances (needed for query params)
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('JobApplicationTracker API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api/docs', app, () =>
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  const port = app.get(ConfigService).get<number>('PORT', 3000);
  await app.listen(port);
}
await bootstrap();
