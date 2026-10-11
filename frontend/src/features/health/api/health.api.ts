import type { HealthStatus } from '@/features/health/types/health.types';
import { httpClient } from '@/shared/api/http-client';
import { ApiEndpoints } from '@/shared/constants/api-endpoints';

export function getHealth(): Promise<HealthStatus>
{
    return httpClient.get<HealthStatus>(ApiEndpoints.Health);
}
