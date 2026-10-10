import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { OpenAPIObject } from '@nestjs/swagger';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';

// Global app configuration in one place, so main.ts and e2e tests set the app up identically.
export function configureApp(app: INestApplication): void
{
    app.setGlobalPrefix('api');
    app.use(helmet());
    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // strip properties not declared in the DTO
            forbidNonWhitelisted: true, // ...and return 400 if any were sent
            transform: true, // convert payloads to DTO class instances (needed for query params)
        }),
    );
    app.useGlobalFilters(new AllExceptionsFilter()); // every error  -> { success: false, error }
    app.useGlobalInterceptors(new ResponseInterceptor()); // every result -> { success: true, data }
}

export function setupSwagger(app: INestApplication): void
{
    const config = new DocumentBuilder()
        .setTitle('JobApplicationTracker API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    SwaggerModule.setup('api/docs', app, (): OpenAPIObject => SwaggerModule.createDocument(app, config));
}
