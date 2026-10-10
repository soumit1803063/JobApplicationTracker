import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../../common/decorators/api-response.decorator.js';
import { UserResponseDto } from '../../user/dto/user-response.dto.js';
import type { PublicUser } from '../../user/types/user.types.js';
import { Authenticated } from '../decorators/authenticated.decorator.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { AuthResponseDto } from '../dto/auth-response.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import { RegisterDto } from '../dto/register.dto.js';
import { AuthService } from '../services/auth.service.js';
import type { AuthTokens, AuthUser } from '../types/auth.types.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController
{
    constructor(private readonly authService: AuthService)
    {}

    @Post('register')
    @ApiSuccessResponse(AuthResponseDto, HttpStatus.CREATED)
    register(@Body() dto: RegisterDto): Promise<AuthTokens>
    {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiSuccessResponse(AuthResponseDto)
    login(@Body() dto: LoginDto): Promise<AuthTokens>
    {
        return this.authService.login(dto);
    }

    @Get('me')
    @Authenticated()
    @ApiSuccessResponse(UserResponseDto)
    me(@CurrentUser() user: AuthUser): Promise<PublicUser>
    {
        return this.authService.me(user.id);
    }
}
