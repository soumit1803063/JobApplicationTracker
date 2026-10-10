import { ApiProperty } from '@nestjs/swagger';
import type { AuthTokens } from '../types/auth.types.js';

// Swagger documentation only.
export class AuthResponseDto implements AuthTokens
{
    @ApiProperty()
    accessToken: string;
}
