import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module.js';
import { AuthModule } from './auth/auth.module.js';
import { envValidationSchema } from './config/env.validation.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthController } from './health/health.controller.js';
import { UserModule } from './user/user.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidationSchema }),
        DatabaseModule,
        UserModule,
        AuthModule,
        ApplicationModule,
    ],
    controllers: [HealthController],
})
export class AppModule
{}
