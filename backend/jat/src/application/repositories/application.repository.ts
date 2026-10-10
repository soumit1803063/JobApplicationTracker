import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  ApplicationListQuery,
  ApplicationPage,
  ApplicationWriteData,
  JobApplication,
} from './application.types.js';

@Injectable()
export class ApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, data: ApplicationWriteData): Promise<JobApplication> {
    return this.prisma.application.create({ data: { ...data, userId } });
  }

  // Filters by userId too, so a user can never load someone else's application.
  findByIdForUser(id: string, userId: string): Promise<JobApplication | null> {
    return this.prisma.application.findFirst({ where: { id, userId } });
  }

  update(id: string, data: ApplicationWriteData): Promise<JobApplication> {
    return this.prisma.application.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.application.delete({ where: { id } });
  }

  async findManyForUser(userId: string, query: ApplicationListQuery): Promise<ApplicationPage> {
    const now = new Date();

    // Each filter becomes one condition (or null when not requested). All conditions must match.
    const conditions = [
      query.search
        ? { jobPost: { contains: query.search, mode: 'insensitive' as const } }
        : null,
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

    const where = { userId, AND: conditions };

    // Nullable columns sort their nulls last, so items without a deadline/salary don't crowd the top.
    const order = query.sortOrder;
    const nullsLast = { sort: order, nulls: 'last' as const };
    const primarySort =
      query.sortBy === 'deadline' ? { deadline: nullsLast }
      : query.sortBy === 'appliedAt' ? { appliedAt: nullsLast }
      : query.sortBy === 'salaryMin' ? { salaryMin: nullsLast }
      : query.sortBy === 'salaryMax' ? { salaryMax: nullsLast }
      : query.sortBy === 'jobPost' ? { jobPost: order }
      : { createdAt: order };

    // Fetch one extra row instead of running a COUNT(*): if it comes back, there is a next page.
    const rows = await this.prisma.application.findMany({
      where,
      // id as a tie-breaker keeps page order stable when sort values are equal.
      orderBy: [primarySort, { id: 'asc' as const }],
      skip: (query.page - 1) * query.limit,
      take: query.limit + 1,
    });

    const hasNext = rows.length > query.limit;
    return { items: hasNext ? rows.slice(0, query.limit) : rows, hasNext };
  }
}
