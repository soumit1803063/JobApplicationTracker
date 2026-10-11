import { ApplyMedium, StatusFilter } from '@/features/applications/applications.constants';
import type {
    ApplicationFilters,
    ApplicationFormErrors,
    ApplicationFormValues,
    ApplicationPayload,
    JobApplication,
} from '@/features/applications/applications.types';
import type { QueryParams } from '@/shared/types';
import { fromDateTimeInputValue, htmlToText, isValidUrl, toDateTimeInputValue } from '@/shared/utils';

export function filtersToQuery(filters: ApplicationFilters): QueryParams
{
    return {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        search: filters.search.trim(),
        applyMedium: filters.applyMedium,
        isApplied: filters.status === StatusFilter.Applied
            ? true
            : filters.status === StatusFilter.NotApplied
            ? false
            : undefined,
        upcoming: filters.status === StatusFilter.Upcoming ? true : undefined,
        expired: filters.status === StatusFilter.Expired ? true : undefined,
    };
}

export function toFormValues(application: JobApplication): ApplicationFormValues
{
    return {
        jobPost: application.jobPost,
        jobPostLink: application.jobPostLink,
        deadline: toDateTimeInputValue(application.deadline),
        applyMedium: application.applyMedium,
        applyLink: application.applyLink ?? '',
        applyMail: application.applyMail ?? '',
        cvLink: application.cvLink ?? '',
        salaryMin: application.salaryMin?.toString() ?? '',
        salaryMax: application.salaryMax?.toString() ?? '',
        salaryCurrency: application.salaryCurrency ?? '',
        isApplied: application.isApplied,
        appliedAt: toDateTimeInputValue(application.appliedAt),
    };
}

export function toPayload(values: ApplicationFormValues): ApplicationPayload
{
    const isLink = values.applyMedium === ApplyMedium.Link;
    return {
        jobPost: values.jobPost.trim(),
        jobPostLink: values.jobPostLink.trim(),
        deadline: fromDateTimeInputValue(values.deadline),
        applyMedium: values.applyMedium,
        applyLink: isLink ? values.applyLink.trim() : null,
        applyMail: isLink ? null : values.applyMail,
        cvLink: values.cvLink.trim() || null,
        salaryMin: values.salaryMin ? Number(values.salaryMin) : null,
        salaryMax: values.salaryMax ? Number(values.salaryMax) : null,
        salaryCurrency: values.salaryCurrency || null,
        isApplied: values.isApplied,
        appliedAt: values.isApplied ? fromDateTimeInputValue(values.appliedAt) : null,
    };
}

export function validateForm(values: ApplicationFormValues): ApplicationFormErrors
{
    const errors: ApplicationFormErrors = {};

    if (!values.jobPost.trim())
    {
        errors.jobPost = 'Job post is required';
    }
    if (!isValidUrl(values.jobPostLink))
    {
        errors.jobPostLink = 'Enter a valid link starting with http:// or https://';
    }
    if (values.applyMedium === ApplyMedium.Link && !isValidUrl(values.applyLink))
    {
        errors.applyLink = 'Enter the link where you apply';
    }
    if (values.applyMedium === ApplyMedium.Mail && !htmlToText(values.applyMail))
    {
        errors.applyMail = 'Write the application mail';
    }
    if (values.cvLink && !isValidUrl(values.cvLink))
    {
        errors.cvLink = 'Enter a valid link starting with http:// or https://';
    }
    if (values.salaryMin && values.salaryMax && Number(values.salaryMin) > Number(values.salaryMax))
    {
        errors.salaryMax = 'Maximum must be greater than minimum';
    }

    return errors;
}

export function formatSalary(application: JobApplication): string
{
    const { salaryMin, salaryMax } = application;
    const currency = application.salaryCurrency ?? '';
    if (salaryMin !== null && salaryMax !== null)
    {
        return `${salaryMin.toLocaleString()} – ${salaryMax.toLocaleString()} ${currency}`;
    }
    if (salaryMin !== null)
    {
        return `From ${salaryMin.toLocaleString()} ${currency}`;
    }
    if (salaryMax !== null)
    {
        return `Up to ${salaryMax.toLocaleString()} ${currency}`;
    }
    return '—';
}

export function isDeadlinePassed(application: JobApplication): boolean
{
    return application.deadline !== null && !application.isApplied && new Date(application.deadline) < new Date();
}
