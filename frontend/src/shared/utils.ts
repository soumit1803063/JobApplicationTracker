import type { QueryParams } from '@/shared/types';

export function buildPath(template: string, params: Record<string, string> = {}): string
{
    return template.replace(/:(\w+)/g, (_match: string, name: string): string =>
    {
        const value = params[name];
        if (value === undefined)
        {
            throw new Error(`Missing path parameter "${name}" for ${template}`);
        }
        return encodeURIComponent(value);
    });
}

export function buildQueryString(query: QueryParams): string
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

export function getErrorMessage(error: unknown): string
{
    if (typeof error === 'string')
    {
        return error;
    }
    if (error instanceof Error)
    {
        return error.message;
    }
    return 'Something went wrong';
}

export function isValidUrl(value: string): boolean
{
    try
    {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    }
    catch
    {
        return false;
    }
}

export function htmlToText(html: string): string
{
    return new DOMParser().parseFromString(html, 'text/html').body.innerText.trim();
}

export function formatDate(value: string | null): string
{
    return value ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—';
}

export function formatDateTime(value: string | null): string
{
    return value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
}

export function toDateTimeInputValue(value: string | null): string
{
    if (!value)
    {
        return '';
    }
    const date = new Date(value);
    const pad = (part: number): string => String(part).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${
        pad(date.getMinutes())
    }`;
}

export function fromDateTimeInputValue(value: string): string | null
{
    return value ? new Date(value).toISOString() : null;
}

export function parseEnum<T extends string>(allowed: readonly T[], value: string, fallback: T): T
{
    return allowed.find((item) => item === value) ?? fallback;
}
