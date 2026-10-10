import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { UserModule } from '../user/user.module.js';
import { AuthController } from './controllers/auth.controller.js';
import { AuthService } from './services/auth.service.js';

@Module({
    imports: [
        UserModule,
        JwtModule.registerAsync({
            global: true, // so AuthGuard / @Authenticated() work in any module
            inject: [ConfigService],
            useFactory: (config: ConfigService): JwtModuleOptions => ({
                secret: config.getOrThrow<string>('JWT_SECRET'),
                // Number(): a string "86400" would be read as milliseconds by jsonwebtoken
                signOptions: { expiresIn: Number(config.getOrThrow<number>('JWT_EXPIRES_IN')) },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule
{}
