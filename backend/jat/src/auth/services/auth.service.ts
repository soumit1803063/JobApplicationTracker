import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import type { PublicUser } from '../user/user.types.js';
import { UserService } from '../user/user.service.js';
import type { AuthTokens, JwtPayload } from './auth.types.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokens> {
    const passwordHash = await hash(dto.password);
    const user = await this.userService.create(dto.email, passwordHash, dto.name);
    return this.signToken(user.id, user.email);
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.userService.findByEmailWithPassword(dto.email);
    // Same message for unknown email and wrong password, so emails can't be probed.
    if (!user || !(await verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.signToken(user.id, user.email);
  }

  async me(userId: string): Promise<PublicUser> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }
    return user;
  }

  private async signToken(userId: string, email: string): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
