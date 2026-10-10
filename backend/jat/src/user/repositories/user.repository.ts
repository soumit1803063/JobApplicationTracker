import { Injectable } from '@nestjs/common';
import { DbContext } from '../../database/db-context.js';
import type { PublicUser, UserWithPassword } from '../types/user.types.js';

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
export class UserRepository
{
    constructor(private readonly db: DbContext)
    {}

    create(email: string, passwordHash: string, name?: string): Promise<PublicUser>
    {
        return this.db.users.create({
            data: { email, passwordHash, name },
            select: publicUserFields,
        });
    }

    async existsByEmail(email: string): Promise<boolean>
    {
        return (await this.db.users.count({ where: { email } })) > 0;
    }

    // Returns the FULL user, including passwordHash. Only for login to verify the password.
    findByEmailWithPassword(email: string): Promise<UserWithPassword | null>
    {
        return this.db.users.findUnique({ where: { email } });
    }

    findById(id: string): Promise<PublicUser | null>
    {
        return this.db.users.findUnique({ where: { id }, select: publicUserFields });
    }
}
