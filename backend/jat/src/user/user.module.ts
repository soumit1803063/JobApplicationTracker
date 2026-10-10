import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository.js';
import { UserService } from './services/user.service.js';

@Module({
    providers: [UserRepository, UserService],
    exports: [UserService], // only the service is public; the repository stays internal
})
export class UserModule
{}
