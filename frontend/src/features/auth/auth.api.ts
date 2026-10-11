import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/features/auth/auth.types';
import { api } from '@/shared/api';
import { ApiEndpoints } from '@/shared/constants';

export function login(request: LoginRequest): Promise<AuthResponse>
{
    return api.post<AuthResponse>(ApiEndpoints.AuthLogin, request);
}

export function register(request: RegisterRequest): Promise<AuthResponse>
{
    return api.post<AuthResponse>(ApiEndpoints.AuthRegister, request);
}

export function getCurrentUser(): Promise<User>
{
    return api.get<User>(ApiEndpoints.AuthMe);
}
