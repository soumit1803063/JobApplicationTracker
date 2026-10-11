import { API_BASE_URL, AppRoutes, TOKEN_STORAGE_KEY } from '@/shared/constants';
import type { ApiResponse, ApiSuccessResponse, Page } from '@/shared/types';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export class ApiError extends Error
{
    readonly status: number;

    constructor(status: number, message: string)
    {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export function getToken(): string | null
{
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function saveToken(token: string): void
{
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken(): void
{
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function parseJson<T>(text: string): ApiResponse<T> | null
{
    try
    {
        return text ? (JSON.parse(text) as ApiResponse<T>) : null;
    }
    catch
    {
        return null;
    }
}

async function request<T>(method: HttpMethod, url: string, body?: unknown): Promise<ApiSuccessResponse<T> | null>
{
    const token = getToken();
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token)
    {
        headers.Authorization = `Bearer ${token}`;
    }
    if (body !== undefined)
    {
        headers['Content-Type'] = 'application/json';
    }

    let response: Response;
    try
    {
        response = await fetch(API_BASE_URL + url, {
            method,
            headers,
            body: body === undefined ? null : JSON.stringify(body),
        });
    }
    catch
    {
        throw new ApiError(0, 'Cannot reach the server');
    }

    if (response.status === 401 && token)
    {
        clearToken();
        window.location.assign(AppRoutes.Login);
    }

    const json = parseJson<T>(await response.text());
    if (json?.success === true)
    {
        return json;
    }
    if (json?.success === false)
    {
        throw new ApiError(json.error.statusCode, json.error.details?.join(', ') ?? json.error.message);
    }
    if (response.ok)
    {
        return null;
    }
    throw new ApiError(response.status, response.statusText || 'Request failed');
}

function dataOf<T>(response: ApiSuccessResponse<T> | null): T
{
    if (!response)
    {
        throw new ApiError(500, 'The server sent an empty response');
    }
    return response.data;
}

export const api = {
    async get<T>(url: string): Promise<T>
    {
        return dataOf(await request<T>('GET', url));
    },

    async getPage<T>(url: string): Promise<Page<T>>
    {
        const response = await request<T[]>('GET', url);
        if (!response?.meta)
        {
            throw new ApiError(500, 'The server did not send pagination info');
        }
        return { items: response.data, meta: response.meta };
    },

    async post<T>(url: string, body: unknown): Promise<T>
    {
        return dataOf(await request<T>('POST', url, body));
    },

    async patch<T>(url: string, body: unknown): Promise<T>
    {
        return dataOf(await request<T>('PATCH', url, body));
    },

    async delete(url: string): Promise<void>
    {
        await request<null>('DELETE', url);
    },
};
