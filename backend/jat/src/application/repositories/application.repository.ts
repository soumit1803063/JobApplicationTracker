import { Injectable } from '@nestjs/common';
import { paginationArgs } from '../../common/utils/pagination.util.js';
import { DbContext } from '../../database/db-context.js';
import type { OrderByOf, WhereOf } from '../../database/db.types.js';
import type { ApplicationListQuery, ApplicationWriteData, JobApplication } from '../types/application.types.js';

@Injectable()
export class ApplicationRepository
{
    constructor(private readonly db: DbContext)
    {}

    create(userId: string, data: ApplicationWriteData): Promise<JobApplication>
    {
        return this.db.applications.create({ data: { ...data, userId } });
    }

    // Filters by userId too, so a user can never load someone else's application.
    findByIdForUser(id: string, userId: string): Promise<JobApplication | null>
    {
        return this.db.applications.findFirst({ where: { id, userId } });
    }

    update(id: string, data: ApplicationWriteData): Promise<JobApplication>
    {
        return this.db.applications.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void>
    {
        await this.db.applications.delete({ where: { id } });
    }

    // Returns up to limit + 1 rows; pass them to toPaginatedResult().
    findManyForUser(userId: string, query: ApplicationListQuery): Promise<JobApplication[]>
    {
        return this.db.applications.findMany({
            where: { userId, AND: this.buildFilters(query) },
            // id as a tie-breaker keeps page order stable when sort values are equal.
            orderBy: [this.buildSort(query), { id: 'asc' as const }],
            ...paginationArgs(query),
        });
    }

    // Each requested filter becomes one condition; all of them must match.
    private buildFilters(query: ApplicationListQuery): WhereOf<'applications'>[]
    {
        const now = new Date();
        return [
            query.search ? { jobPost: { contains: query.search, mode: 'insensitive' as const } } : null,
            query.isApplied !== undefined ? { isApplied: query.isApplied } : null,
            query.applyMedium ? { applyMedium: query.applyMedium } : null,
            query.deadlineFrom || query.deadlineTo
                ? { deadline: { gte: query.deadlineFrom, lte: query.deadlineTo } }
                : null,
            query.appliedFrom || query.appliedTo
                ? { appliedAt: { gte: query.appliedFrom, lte: query.appliedTo } }
                : null,
            // Salary ranges overlap: job's max reaches our min, job's min is within our max.
            query.salaryMin !== undefined ? { salaryMax: { gte: query.salaryMin } } : null,
            query.salaryMax !== undefined ? { salaryMin: { lte: query.salaryMax } } : null,
            query.upcoming ? { isApplied: false, deadline: { gte: now } } : null,
            query.expired ? { isApplied: false, deadline: { lt: now } } : null,
        ].filter((condition) => condition !== null);
    }

    // Nullable columns sort their nulls last, so items without a deadline/salary don't crowd the top.
    private buildSort({ sortBy, sortOrder }: ApplicationListQuery): OrderByOf<'applications'>
    {
        const nullsLast = { sort: sortOrder, nulls: 'last' as const };
        switch (sortBy)
        {
            case 'deadline':
                return { deadline: nullsLast };
            case 'appliedAt':
                return { appliedAt: nullsLast };
            case 'salaryMin':
                return { salaryMin: nullsLast };
            case 'salaryMax':
                return { salaryMax: nullsLast };
            case 'jobPost':
                return { jobPost: sortOrder };
            case 'createdAt':
                return { createdAt: sortOrder };
        }
    }
}
