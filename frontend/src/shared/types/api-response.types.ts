export interface PaginationMeta
{
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface ApiSuccessResponse<TData>
{
    success: true;
    data: TData;
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
    path: string;
    timestamp: string;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
