import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { ApplicationRepository } from './application.repository.js';
import { ApplyMedium } from './application.types.js';
import type {
  ApplicationListQuery,
  ApplicationWriteData,
  JobApplication,
  Paginated,
} from './application.types.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';

// Tags allowed in the rich-text apply mail. Everything else (scripts, iframes, styles...) is stripped.
const MAIL_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'blockquote', 'code', 'pre'],
  allowedAttributes: { a: ['href', 'target', 'rel'] },
  allowedSchemes: ['http', 'https', 'mailto'],
};

// For PATCH: undefined = field not sent (keep current value); null = clear it.
function keep<T>(next: T | null | undefined, current: T | null): T | null {
  return next === undefined ? current : next;
}

@Injectable()
export class ApplicationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  create(userId: string, dto: CreateApplicationDto): Promise<JobApplication> {
    const data = this.applyRules({
      jobPost: dto.jobPost,
      jobPostLink: dto.jobPostLink,
      deadline: dto.deadline ?? null,
      applyMedium: dto.applyMedium,
      applyLink: dto.applyLink ?? null,
      applyMail: dto.applyMail ?? null,
      salaryMin: dto.salaryMin ?? null,
      salaryMax: dto.salaryMax ?? null,
      salaryCurrency: dto.salaryCurrency ?? null,
      isApplied: dto.isApplied ?? false,
      appliedAt: dto.appliedAt ?? null,
    });
    return this.applicationRepository.create(userId, data);
  }

  async findAll(userId: string, query: ApplicationListQuery): Promise<Paginated<JobApplication>> {
    const { items, hasNext } = await this.applicationRepository.findManyForUser(userId, query);

    return {
      data: items,
      meta: {
        page: query.page,
        limit: query.limit,
        hasNext,
        hasPrev: query.page > 1,
      },
    };
  }

  async findOne(userId: string, id: string): Promise<JobApplication> {
    const application = await this.applicationRepository.findByIdForUser(id, userId);
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  async update(userId: string, id: string, dto: UpdateApplicationDto): Promise<JobApplication> {
    const existing = await this.findOne(userId, id);

    // Merge the changes onto the current row, then re-check the rules on the result.
    const data = this.applyRules({
      jobPost: dto.jobPost ?? existing.jobPost,
      jobPostLink: dto.jobPostLink ?? existing.jobPostLink,
      deadline: keep(dto.deadline, existing.deadline),
      applyMedium: dto.applyMedium ?? existing.applyMedium,
      applyLink: keep(dto.applyLink, existing.applyLink),
      applyMail: keep(dto.applyMail, existing.applyMail),
      salaryMin: keep(dto.salaryMin, existing.salaryMin),
      salaryMax: keep(dto.salaryMax, existing.salaryMax),
      salaryCurrency: keep(dto.salaryCurrency, existing.salaryCurrency),
      isApplied: dto.isApplied ?? existing.isApplied,
      appliedAt: keep(dto.appliedAt, existing.appliedAt),
    });
    return this.applicationRepository.update(id, data);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id); // 404 if it doesn't exist or isn't yours
    await this.applicationRepository.delete(id);
  }

  // Business rules shared by create and update.
  private applyRules(data: ApplicationWriteData): ApplicationWriteData {
    let applyLink = data.applyLink;
    let applyMail = data.applyMail;

    if (data.applyMedium === ApplyMedium.LINK) {
      if (!applyLink) {
        throw new BadRequestException('applyLink is required when applyMedium is LINK');
      }
      applyMail = null;
    } else {
      applyMail = applyMail ? sanitizeHtml(applyMail, MAIL_SANITIZE_OPTIONS) : null;
      if (!applyMail || !this.hasText(applyMail)) {
        throw new BadRequestException('applyMail is required when applyMedium is MAIL');
      }
      applyLink = null;
    }

    if (data.salaryMin !== null && data.salaryMax !== null && data.salaryMin > data.salaryMax) {
      throw new BadRequestException('salaryMin cannot be greater than salaryMax');
    }

    return {
      ...data,
      applyLink,
      applyMail,
      // Applied → keep the given date or use now. Not applied → no applied date.
      appliedAt: data.isApplied ? (data.appliedAt ?? new Date()) : null,
    };
  }

  // True if the HTML has visible text (so "<p></p>" counts as empty).
  private hasText(html: string): boolean {
    return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim().length > 0;
  }
}
