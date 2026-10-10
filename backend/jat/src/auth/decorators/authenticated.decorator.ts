import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard.js';

// One decorator for protected routes/controllers: requires a JWT and documents it in Swagger.
export function Authenticated(): ReturnType<typeof applyDecorators>
{
    return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth());
}
