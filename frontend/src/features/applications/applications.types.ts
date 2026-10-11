import type { ApplyMedium, SortField, SortOrder, StatusFilter } from '@/features/applications/applications.constants';
import type { PaginationMeta, RequestStatus } from '@/shared/types';

export interface JobApplication
{
    id: string;
    jobPost: string;
    jobPostLink: string;
    deadline: string | null;
    applyMedium: ApplyMedium;
    applyLink: string | null;
    applyMail: string | null;
    cvLink: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string | null;
    isApplied: boolean;
    appliedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export type ApplicationPayload = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>;

export interface ApplicationFilters
{
    search: string;
    status: StatusFilter;
    applyMedium: ApplyMedium | '';
    sortBy: SortField;
    sortOrder: SortOrder;
    page: number;
    limit: number;
}

export interface ApplicationFormValues
{
    jobPost: string;
    jobPostLink: string;
    deadline: string;
    applyMedium: ApplyMedium;
    applyLink: string;
    applyMail: string;
    cvLink: string;
    salaryMin: string;
    salaryMax: string;
    salaryCurrency: string;
    isApplied: boolean;
    appliedAt: string;
}

export type ApplicationFormErrors = Partial<Record<keyof ApplicationFormValues, string>>;

export interface ApplicationsState
{
    filters: ApplicationFilters;
    items: JobApplication[];
    meta: PaginationMeta | null;
    listStatus: RequestStatus;
    listError: string | null;
    selected: JobApplication | null;
    selectedStatus: RequestStatus;
    selectedError: string | null;
    saveStatus: RequestStatus;
    saveError: string | null;
}
