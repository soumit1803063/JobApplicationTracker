import type { Request } from 'express';

// The logged-in user, as attached to the request by AuthGuard.
export interface AuthUser {
  id: string;
  email: string;
}

export type AuthenticatedRequest = Request & { user: AuthUser };

// What we put inside the JWT.
export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
}
