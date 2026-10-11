import { ApiError } from '@/shared/api/api-error';

export function getErrorMessage(error: unknown): string
{
    if (error instanceof ApiError)
    {
        return error.details.length > 0 ? error.details.join(', ') : error.message;
    }
    if (error instanceof Error)
    {
        return error.message;
    }
    return 'Something went wrong';
}
