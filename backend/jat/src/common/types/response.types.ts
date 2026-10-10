import type { PaginationMeta } from './pagination.types.js';

// Every successful response: { success: true, data, meta? }
export interface SuccessResponseBody<T>
{
    success: true;
    data: T;
    meta?: PaginationMeta;
}

// Every error response: { success: false, error: {...}, path, timestamp }
export interface ErrorResponseBody
{
    success: false;
    error: {
        statusCode: number;
        message: string;
        details?: string[];
    };
    path: string;
    timestamp: string;
}
