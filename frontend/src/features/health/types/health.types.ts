import type { RequestStatus } from '../../../shared/types/request-status.types';

export interface HealthStatus
{
    status: 'ok';
    timestamp: string;
}

export interface HealthState
{
    data: HealthStatus | null;
    status: RequestStatus;
    error: string | null;
}
