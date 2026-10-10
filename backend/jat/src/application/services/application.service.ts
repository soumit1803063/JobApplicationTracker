import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { sanitizeRichText } from '../../common/utils/html.util.js';
import { mergeDefined } from '../../common/utils/merge.util.js';
import { toPaginatedResult } from '../../common/utils/pagination.util.js';
import type { PaginatedResult } from '../../common/utils/pagination.util.js';
import { ApplyMedium } from '../constants/application.constants.js';
import { CreateApplicationDto } from '../dto/create-application.dto.js';
import { UpdateApplicationDto } from '../dto/update-application.dto.js';
import { ApplicationRepository } from '../repositories/application.repository.js';
import type { ApplicationListQuery, ApplicationWriteData, JobApplication } from '../types/application.types.js';

// Values for optional fields when they are not sent on create.
const OPTIONAL_FIELD_DEFAULTS = {
    deadline: null,
    applyLink: null,
    applyMail: null,
    cvLink: null,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    isApplied: false,
    appliedAt: null,
} satisfies Partial<ApplicationWriteData>;

@Injectable()
export class ApplicationService
{
    constructor(private readonly applicationRepository: ApplicationRepository)
    {}

    create(userId: string, dto: CreateApplicationDto): Promise<JobApplication>
    {
        const { jobPost, jobPostLink, applyMedium } = dto;
        const data = mergeDefined<ApplicationWriteData>({
            ...OPTIONAL_FIELD_DEFAULTS,
            jobPost,
            jobPostLink,
            applyMedium,
        }, dto);
        return this.applicationRepository.create(userId, this.applyRules(data));
    }

    async findAll(userId: string, query: ApplicationListQuery): Promise<PaginatedResult<JobApplication>>
    {
        const rows = await this.applicationRepository.findManyForUser(userId, query);
        return toPaginatedResult(rows, query);
    }

    async findOne(userId: string, id: string): Promise<JobApplication>
    {
        const application = await this.applicationRepository.findByIdForUser(id, userId);
        if (!application)
        {
            throw new NotFoundException('Application not found');
        }
        return application;
    }

    async update(userId: string, id: string, dto: UpdateApplicationDto): Promise<JobApplication>
    {
        const existing = await this.findOne(userId, id);
        // Sent fields replace current values (null clears); then the rules are re-checked on the result.
        const data = mergeDefined<ApplicationWriteData>(existing, dto);
        return this.applicationRepository.update(id, this.applyRules(data));
    }

    async remove(userId: string, id: string): Promise<void>
    {
        await this.findOne(userId, id); // 404 if it doesn't exist or isn't yours
        await this.applicationRepository.delete(id);
    }

    // Business rules shared by create and update. Returns exactly the writable fields.
    private applyRules(data: ApplicationWriteData): ApplicationWriteData
    {
        const isLink = data.applyMedium === ApplyMedium.LINK;
        const applyLink = isLink ? data.applyLink : null;
        const applyMail = isLink ? null : sanitizeRichText(data.applyMail);

        if (isLink && !applyLink)
        {
            throw new BadRequestException('applyLink is required when applyMedium is LINK');
        }
        if (!isLink && !applyMail)
        {
            throw new BadRequestException('applyMail is required when applyMedium is MAIL');
        }
        if (data.salaryMin !== null && data.salaryMax !== null && data.salaryMin > data.salaryMax)
        {
            throw new BadRequestException('salaryMin cannot be greater than salaryMax');
        }

        return {
            jobPost: data.jobPost,
            jobPostLink: data.jobPostLink,
            deadline: data.deadline,
            applyMedium: data.applyMedium,
            applyLink,
            applyMail,
            cvLink: data.cvLink,
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            salaryCurrency: data.salaryCurrency,
            isApplied: data.isApplied,
            // Applied: keep the given date or use now. Not applied: no applied date.
            appliedAt: data.isApplied ? (data.appliedAt ?? new Date()) : null,
        };
    }
}
