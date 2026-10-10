export const ApplyMedium = {
  LINK: 'LINK',
  MAIL: 'MAIL',
} as const;
export type ApplyMedium = (typeof ApplyMedium)[keyof typeof ApplyMedium];

export const APPLICATION_SORT_FIELDS = [
  'createdAt',
  'deadline',
  'appliedAt',
  'salaryMin',
  'salaryMax',
  'jobPost',
] as const;
export type ApplicationSortField = (typeof APPLICATION_SORT_FIELDS)[number];

export const SORT_ORDERS = ['asc', 'desc'] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

export interface JobApplication {
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

export interface ApplicationListQuery {
  page: number;
  limit: number;
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

export interface ApplicationPage {
  items: JobApplication[];
  hasNext: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
