import { ApiProperty } from '@nestjs/swagger';
import { APPLY_MEDIUMS } from '../constants/application.constants.js';
import type { ApplyMedium } from '../constants/application.constants.js';
import type { JobApplication } from '../types/application.types.js';

// Swagger documentation only.
export class ApplicationResponseDto implements JobApplication
{
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

    @ApiProperty({ enum: APPLY_MEDIUMS })
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
