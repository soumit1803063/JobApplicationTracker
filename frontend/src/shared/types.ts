export enum RequestStatus
{
    Idle = 'idle',
    Loading = 'loading',
    Succeeded = 'succeeded',
    Failed = 'failed',
}

export interface PaginationMeta
{
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface Page<T>
{
    items: T[];
    meta: PaginationMeta;
}

export interface ApiSuccessResponse<T>
{
    success: true;
    data: T;
    meta?: PaginationMeta;
}

export interface ApiErrorResponse
{
    success: false;
    error: {
        statusCode: number;
        message: string;
        details?: string[];
    };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type QueryParams = Record<string, string | number | boolean | null | undefined>;
