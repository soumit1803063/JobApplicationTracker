import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp, setupSwagger } from './app.setup.js';

async function bootstrap(): Promise<void>
{
    const app = await NestFactory.create(AppModule);
    configureApp(app);
    setupSwagger(app);

    const port = app.get(ConfigService).get<number>('PORT', 3000);
    await app.listen(port);
}
await bootstrap();
