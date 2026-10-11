import type { ApplicationFilters, ApplicationFormValues } from '@/features/applications/applications.types';

export enum ApplyMedium
{
    Link = 'LINK',
    Mail = 'MAIL',
}

export enum SortField
{
    CreatedAt = 'createdAt',
    Deadline = 'deadline',
    AppliedAt = 'appliedAt',
    SalaryMax = 'salaryMax',
    JobPost = 'jobPost',
}

export enum SortOrder
{
    Asc = 'asc',
    Desc = 'desc',
}

export enum StatusFilter
{
    All = 'all',
    Applied = 'applied',
    NotApplied = 'notApplied',
    Upcoming = 'upcoming',
    Expired = 'expired',
}

export const APPLY_MEDIUM_FILTERS: (ApplyMedium | '')[] = ['', ApplyMedium.Link, ApplyMedium.Mail];

export const SORT_OPTIONS: { value: SortField; label: string; }[] = [
    { value: SortField.CreatedAt, label: 'Date added' },
    { value: SortField.Deadline, label: 'Deadline' },
    { value: SortField.AppliedAt, label: 'Applied date' },
    { value: SortField.SalaryMax, label: 'Salary' },
    { value: SortField.JobPost, label: 'Job post' },
];

export const STATUS_OPTIONS: { value: StatusFilter; label: string; }[] = [
    { value: StatusFilter.All, label: 'All' },
    { value: StatusFilter.NotApplied, label: 'Not applied' },
    { value: StatusFilter.Applied, label: 'Applied' },
    { value: StatusFilter.Upcoming, label: 'Deadline ahead' },
    { value: StatusFilter.Expired, label: 'Deadline passed' },
];

export const PAGE_SIZES = [10, 20, 50];

export const CURRENCIES = ['BDT', 'USD', 'EUR', 'GBP', 'INR'];

export const DEFAULT_FILTERS: ApplicationFilters = {
    search: '',
    status: StatusFilter.All,
    applyMedium: '',
    sortBy: SortField.CreatedAt,
    sortOrder: SortOrder.Desc,
    page: 1,
    limit: 10,
};

export const EMPTY_FORM_VALUES: ApplicationFormValues = {
    jobPost: '',
    jobPostLink: '',
    deadline: '',
    applyMedium: ApplyMedium.Link,
    applyLink: '',
    applyMail: '',
    cvLink: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: '',
    isApplied: false,
    appliedAt: '',
};
