import type { PaginationMeta, PaginationQuery } from '../types/pagination.types.js';

// Returned by services for list endpoints; ResponseInterceptor turns it into { data, meta }.
export class PaginatedResult<T>
{
    constructor(
        readonly data: T[],
        readonly meta: PaginationMeta,
    )
    {}
}

// skip/take for a list query. Takes one extra row so we can tell if a next page exists
// without running a COUNT(*).
export function paginationArgs(query: PaginationQuery): { skip: number; take: number; }
{
    return { skip: (query.page - 1) * query.limit, take: query.limit + 1 };
}

// Pair of paginationArgs(): drops the extra row and builds the meta.
export function toPaginatedResult<T>(rows: T[], query: PaginationQuery): PaginatedResult<T>
{
    const hasNext = rows.length > query.limit;
    return new PaginatedResult(hasNext ? rows.slice(0, query.limit) : rows, {
        page: query.page,
        limit: query.limit,
        hasNext,
        hasPrev: query.page > 1,
    });
}
