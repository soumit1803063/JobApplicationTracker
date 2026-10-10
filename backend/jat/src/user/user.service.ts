import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(email: string, passwordHash: string, name?: string) {
    email = this.normalizeEmail(email);

    if (await this.userRepository.existsByEmail(email)) {
      throw new ConflictException('Email is already registered');
    }

    return this.userRepository.create(email, passwordHash, name);
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository.findByEmailWithPassword(this.normalizeEmail(email));
  }

  findById(id: string) {
    return this.userRepository.findById(id);
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }
}
