import type { PaginationMeta } from '@/shared/types/api-response.types';

export type QueryValue = string | number | boolean | null | undefined;

export type QueryParams = Record<string, QueryValue>;

export type PathParams = Record<string, string>;

export interface RequestOptions
{
    params?: PathParams;
    query?: QueryParams;
}

export interface PaginatedData<TItem>
{
    items: TItem[];
    meta: PaginationMeta;
}
