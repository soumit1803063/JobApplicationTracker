import type { HealthStatus } from '@/features/health/types/health.types';
import { ApiEndpoints } from '@/shared/constants/api-endpoints';
import { apiUrl } from '@/shared/helpers/api-url.helper';
import type { ApiResponse } from '@/shared/types/api-response.types';

export async function getHealth(): Promise<HealthStatus>
{
    const response = await fetch(apiUrl(ApiEndpoints.Health));
    const body = (await response.json()) as ApiResponse<HealthStatus>;

    if (!body.success)
    {
        throw new Error(body.error.message);
    }
    return body.data;
}
