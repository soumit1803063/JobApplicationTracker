import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

// Fields that are safe to send to the client: everything except passwordHash.
const publicUserFields = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(email: string, passwordHash: string, name?: string) {
    return this.prisma.user.create({
      data: { email, passwordHash, name },
      select: publicUserFields,
    });
  }

  async existsByEmail(email: string) {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }

  // Returns the FULL user, including passwordHash. Only for login to verify the password.
  findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserFields,
    });
  }
}
