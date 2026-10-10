import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository.js';
import type { PublicUser, UserWithPassword } from '../types/user.types.js';

// Emails arrive already trimmed + lowercased (see the auth DTOs).
@Injectable()
export class UserService
{
    constructor(private readonly userRepository: UserRepository)
    {}

    async create(email: string, passwordHash: string, name?: string): Promise<PublicUser>
    {
        if (await this.userRepository.existsByEmail(email))
        {
            throw new ConflictException('Email is already registered');
        }
        return this.userRepository.create(email, passwordHash, name);
    }

    findByEmailWithPassword(email: string): Promise<UserWithPassword | null>
    {
        return this.userRepository.findByEmailWithPassword(email);
    }

    findById(id: string): Promise<PublicUser | null>
    {
        return this.userRepository.findById(id);
    }
}
