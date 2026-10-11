import type { RequestStatus } from '@/shared/types';

export interface User
{
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest
{
    email: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest
{
    name?: string;
}

export interface AuthResponse
{
    accessToken: string;
}

export interface AuthState
{
    user: User | null;
    isSessionChecked: boolean;
    status: RequestStatus;
    error: string | null;
}
