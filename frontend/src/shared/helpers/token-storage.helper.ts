import { StorageKeys } from '@/shared/constants/storage-keys';

export function getAccessToken(): string | null
{
    return localStorage.getItem(StorageKeys.AccessToken);
}

export function setAccessToken(token: string): void
{
    localStorage.setItem(StorageKeys.AccessToken, token);
}

export function clearAccessToken(): void
{
    localStorage.removeItem(StorageKeys.AccessToken);
}
