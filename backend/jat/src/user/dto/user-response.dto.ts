import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { PublicUser } from '../types/user.types.js';

// Swagger documentation only.
export class UserResponseDto implements PublicUser
{
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @ApiPropertyOptional({ type: String, nullable: true, example: 'John Doe' })
    name: string | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
