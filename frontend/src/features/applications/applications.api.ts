import type {
    ApplicationFilters,
    ApplicationPayload,
    JobApplication,
} from '@/features/applications/applications.types';
import { filtersToQuery } from '@/features/applications/applications.utils';
import { api } from '@/shared/api';
import { ApiEndpoints } from '@/shared/constants';
import type { Page } from '@/shared/types';
import { buildPath, buildQueryString } from '@/shared/utils';

function applicationUrl(id: string): string
{
    return buildPath(ApiEndpoints.ApplicationById, { id });
}

export function getApplications(filters: ApplicationFilters): Promise<Page<JobApplication>>
{
    return api.getPage<JobApplication>(ApiEndpoints.Applications + buildQueryString(filtersToQuery(filters)));
}

export function getApplication(id: string): Promise<JobApplication>
{
    return api.get<JobApplication>(applicationUrl(id));
}

export function createApplication(payload: ApplicationPayload): Promise<JobApplication>
{
    return api.post<JobApplication>(ApiEndpoints.Applications, payload);
}

export function updateApplication(id: string, payload: Partial<ApplicationPayload>): Promise<JobApplication>
{
    return api.patch<JobApplication>(applicationUrl(id), payload);
}

export function deleteApplication(id: string): Promise<void>
{
    return api.delete(applicationUrl(id));
}
