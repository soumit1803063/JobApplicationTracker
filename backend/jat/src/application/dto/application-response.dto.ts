import { ApiProperty } from '@nestjs/swagger';
import { ApplyMedium } from '../application.types.js';
import type { JobApplication, Paginated, PaginationMeta } from '../application.types.js';

// Swagger documentation only.
export class ApplicationResponseDto implements JobApplication {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty()
  jobPost: string;

  @ApiProperty()
  jobPostLink: string;

  @ApiProperty({ type: Date, nullable: true })
  deadline: Date | null;

  @ApiProperty({ enum: Object.values(ApplyMedium) })
  applyMedium: ApplyMedium;

  @ApiProperty({ type: String, nullable: true })
  applyLink: string | null;

  @ApiProperty({ type: String, nullable: true })
  applyMail: string | null;

  @ApiProperty({ type: Number, nullable: true })
  salaryMin: number | null;

  @ApiProperty({ type: Number, nullable: true })
  salaryMax: number | null;

  @ApiProperty({ type: String, nullable: true })
  salaryCurrency: string | null;

  @ApiProperty()
  isApplied: boolean;

  @ApiProperty({ type: Date, nullable: true })
  appliedAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginationMetaDto implements PaginationMeta {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrev: boolean;
}

export class PaginatedApplicationsResponseDto implements Paginated<JobApplication> {
  @ApiProperty({ type: [ApplicationResponseDto] })
  data: ApplicationResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
