import { ApiError } from '@/shared/api/api-error';
import type { ApiEndpoints } from '@/shared/constants/api-endpoints';
import { HttpMethod } from '@/shared/constants/http-method';
import { apiUrl } from '@/shared/helpers/api-url.helper';
import { buildQueryString } from '@/shared/helpers/query-string.helper';
import { getAccessToken } from '@/shared/helpers/token-storage.helper';
import type { ApiResponse, ApiSuccessResponse } from '@/shared/types/api-response.types';
import type { PaginatedData, RequestOptions } from '@/shared/types/http.types';

async function parseBody<TData>(response: Response): Promise<ApiResponse<TData> | null>
{
    const text = await response.text();
    if (!text)
    {
        return null;
    }
    try
    {
        return JSON.parse(text) as ApiResponse<TData>;
    }
    catch
    {
        return null;
    }
}

async function send<TData>(
    method: HttpMethod,
    endpoint: ApiEndpoints,
    options: RequestOptions = {},
    body?: unknown,
): Promise<ApiSuccessResponse<TData> | null>
{
    const headers = new Headers({ Accept: 'application/json' });
    const token = getAccessToken();
    if (token)
    {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (body !== undefined)
    {
        headers.set('Content-Type', 'application/json');
    }

    const url = apiUrl(endpoint, options.params) + buildQueryString(options.query);
    const requestBody = body === undefined ? null : JSON.stringify(body);

    let response: Response;
    try
    {
        response = await fetch(url, { method, headers, body: requestBody });
    }
    catch
    {
        throw new ApiError(0, 'Cannot reach the server');
    }

    const parsed = await parseBody<TData>(response);
    if (parsed?.success === true)
    {
        return parsed;
    }
    if (parsed?.success === false)
    {
        throw new ApiError(parsed.error.statusCode, parsed.error.message, parsed.error.details);
    }
    if (response.ok)
    {
        return null;
    }
    throw new ApiError(response.status, response.statusText || 'Request failed');
}

async function sendForData<TData>(
    method: HttpMethod,
    endpoint: ApiEndpoints,
    options?: RequestOptions,
    body?: unknown,
): Promise<TData>
{
    const parsed = await send<TData>(method, endpoint, options, body);
    if (!parsed)
    {
        throw new ApiError(500, 'Empty response from server');
    }
    return parsed.data;
}

export const httpClient = {
    get<TData>(endpoint: ApiEndpoints, options?: RequestOptions): Promise<TData>
    {
        return sendForData<TData>(HttpMethod.Get, endpoint, options);
    },

    async getPaginated<TItem>(endpoint: ApiEndpoints, options?: RequestOptions): Promise<PaginatedData<TItem>>
    {
        const parsed = await send<TItem[]>(HttpMethod.Get, endpoint, options);
        if (!parsed?.meta)
        {
            throw new ApiError(500, 'Expected a paginated response');
        }
        return { items: parsed.data, meta: parsed.meta };
    },

    post<TData>(endpoint: ApiEndpoints, body: unknown, options?: RequestOptions): Promise<TData>
    {
        return sendForData<TData>(HttpMethod.Post, endpoint, options, body);
    },

    patch<TData>(endpoint: ApiEndpoints, body: unknown, options?: RequestOptions): Promise<TData>
    {
        return sendForData<TData>(HttpMethod.Patch, endpoint, options, body);
    },

    async delete(endpoint: ApiEndpoints, options?: RequestOptions): Promise<void>
    {
        await send<null>(HttpMethod.Delete, endpoint, options);
    },
};
