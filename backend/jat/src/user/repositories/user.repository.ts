import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { PublicUser, UserWithPassword } from './user.types.js';

// Fields that are safe to send to the client: everything except passwordHash.
// `satisfies` makes TS fail if this ever drifts from the PublicUser interface.
const publicUserFields = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Record<keyof PublicUser, true>;

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(email: string, passwordHash: string, name?: string): Promise<PublicUser> {
    return this.prisma.user.create({
      data: { email, passwordHash, name },
      select: publicUserFields,
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }

  // Returns the FULL user, including passwordHash. Only for login to verify the password.
  findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserFields,
    });
  }
}
