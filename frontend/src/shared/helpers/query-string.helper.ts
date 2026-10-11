import type { QueryParams } from '@/shared/types/http.types';

export function buildQueryString(query: QueryParams = {}): string
{
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query))
    {
        if (value !== undefined && value !== null && value !== '')
        {
            search.append(key, String(value));
        }
    }
    const text = search.toString();
    return text ? `?${text}` : '';
}
