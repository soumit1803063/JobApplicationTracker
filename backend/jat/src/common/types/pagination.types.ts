export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

export interface PaginationQuery
{
    page: number;
    limit: number;
}

export interface PaginationMeta
{
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}
