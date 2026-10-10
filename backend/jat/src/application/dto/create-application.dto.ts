import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsIn,
    IsInt,
    IsISO4217CurrencyCode,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    Min,
} from 'class-validator';
import { toTrimmedUpperCase } from '../../common/utils/transform.util.js';
import { APPLY_MEDIUMS, ApplyMedium } from '../constants/application.constants.js';

export class CreateApplicationDto
{
    @ApiProperty({ example: 'Senior Backend Engineer at Acme' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    jobPost: string;

    @ApiProperty({ example: 'https://acme.com/careers/123' })
    @IsUrl({ require_protocol: true })
    jobPostLink: string;

    @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    deadline?: Date | null;

    @ApiProperty({ enum: APPLY_MEDIUMS })
    @IsIn(APPLY_MEDIUMS)
    applyMedium: ApplyMedium;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Required when applyMedium is LINK',
        example: 'https://acme.com/apply/123',
    })
    @IsOptional()
    @IsUrl({ require_protocol: true })
    applyLink?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Rich text (HTML). Required when applyMedium is MAIL',
        example: '<p>Dear Hiring Manager,</p><p>Please find my CV attached.</p>',
    })
    @IsOptional()
    @IsString()
    @MaxLength(50_000)
    applyMail?: string | null;

    @ApiPropertyOptional({
        type: String,
        nullable: true,
        description: 'Link to the CV used for this application',
        example: 'https://drive.google.com/file/d/abc123/view',
    })
    @IsOptional()
    @IsUrl({ require_protocol: true })
    @MaxLength(2048)
    cvLink?: string | null;

    @ApiPropertyOptional({ type: Number, nullable: true, example: 80000 })
    @IsOptional()
    @IsInt()
    @Min(0)
    salaryMin?: number | null;

    @ApiPropertyOptional({ type: Number, nullable: true, example: 120000 })
    @IsOptional()
    @IsInt()
    @Min(0)
    salaryMax?: number | null;

    @ApiPropertyOptional({ type: String, nullable: true, example: 'BDT' })
    @IsOptional()
    @Transform(toTrimmedUpperCase)
    @IsISO4217CurrencyCode()
    salaryCurrency?: string | null;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    isApplied?: boolean;

    @ApiPropertyOptional({
        type: String,
        format: 'date-time',
        nullable: true,
        description: 'Defaults to now when isApplied is true',
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    appliedAt?: Date | null;
}
