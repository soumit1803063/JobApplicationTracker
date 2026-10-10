export const ApplyMedium = {
    LINK: 'LINK',
    MAIL: 'MAIL',
} as const;
export type ApplyMedium = (typeof ApplyMedium)[keyof typeof ApplyMedium];

export const APPLY_MEDIUMS = Object.values(ApplyMedium);

export const APPLICATION_SORT_FIELDS = [
    'createdAt',
    'deadline',
    'appliedAt',
    'salaryMin',
    'salaryMax',
    'jobPost',
] as const;
export type ApplicationSortField = (typeof APPLICATION_SORT_FIELDS)[number];
