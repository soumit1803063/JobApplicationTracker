import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

@Module({
  providers: [UserRepository, UserService],
  exports: [UserService], // only the service is public; the repository stays internal
})
export class UserModule {}
