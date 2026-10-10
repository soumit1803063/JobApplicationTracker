import type { PaginationQuery, SortOrder } from '../../common/types/pagination.types.js';
import type { ApplicationSortField, ApplyMedium } from '../constants/application.constants.js';

export interface JobApplication
{
    id: string;
    userId: string;
    jobPost: string;
    jobPostLink: string;
    deadline: Date | null;
    applyMedium: ApplyMedium;
    applyLink: string | null;
    applyMail: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    salaryCurrency: string | null;
    isApplied: boolean;
    appliedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// The fields a user can write. id, userId and timestamps are managed by the server.
export type ApplicationWriteData = Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface ApplicationListQuery extends PaginationQuery
{
    sortBy: ApplicationSortField;
    sortOrder: SortOrder;
    search?: string;
    isApplied?: boolean;
    applyMedium?: ApplyMedium;
    deadlineFrom?: Date;
    deadlineTo?: Date;
    appliedFrom?: Date;
    appliedTo?: Date;
    salaryMin?: number;
    salaryMax?: number;
    upcoming?: boolean;
    expired?: boolean;
}
