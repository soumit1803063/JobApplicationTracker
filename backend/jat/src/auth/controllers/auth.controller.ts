import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '../user/dto/user-response.dto.js';
import type { PublicUser } from '../user/user.types.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import type { AuthTokens, AuthUser } from './auth.types.js';
import { CurrentUser } from './current-user.decorator.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: AuthResponseDto })
  register(@Body() dto: RegisterDto): Promise<AuthTokens> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthResponseDto })
  login(@Body() dto: LoginDto): Promise<AuthTokens> {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  me(@CurrentUser() user: AuthUser): Promise<PublicUser> {
    return this.authService.me(user.id);
  }
}
