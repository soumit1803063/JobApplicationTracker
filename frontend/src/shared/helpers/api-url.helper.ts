import { API_BASE_URL } from '@/shared/constants/api-endpoints';
import type { ApiEndpoints } from '@/shared/constants/api-endpoints';

export function apiUrl(endpoint: ApiEndpoints, params: Record<string, string> = {}): string
{
    const path = endpoint.replace(/:(\w+)/g, (_match: string, name: string): string =>
    {
        const value = params[name];
        if (value === undefined)
        {
            throw new Error(`Missing URL parameter "${name}" for ${endpoint}`);
        }
        return encodeURIComponent(value);
    });
    return `${API_BASE_URL}${path}`;
}
