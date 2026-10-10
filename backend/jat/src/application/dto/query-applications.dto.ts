import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { SORT_ORDERS } from '../../common/types/pagination.types.js';
import type { SortOrder } from '../../common/types/pagination.types.js';
import { toBoolean } from '../../common/utils/transform.util.js';
import { APPLICATION_SORT_FIELDS, APPLY_MEDIUMS } from '../constants/application.constants.js';
import type { ApplicationSortField, ApplyMedium } from '../constants/application.constants.js';
import type { ApplicationListQuery } from '../types/application.types.js';

// page + limit come from PaginationQueryDto.
export class QueryApplicationsDto extends PaginationQueryDto implements ApplicationListQuery
{
    // ---- Sorting ----
    @ApiPropertyOptional({ enum: APPLICATION_SORT_FIELDS, default: 'createdAt' })
    @IsOptional()
    @IsIn(APPLICATION_SORT_FIELDS)
    sortBy: ApplicationSortField = 'createdAt';

    @ApiPropertyOptional({ enum: SORT_ORDERS, default: 'desc' })
    @IsOptional()
    @IsIn(SORT_ORDERS)
    sortOrder: SortOrder = 'desc';

    // ---- Filters ----
    @ApiPropertyOptional({ description: 'Case-insensitive search in jobPost' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    search?: string;

    @ApiPropertyOptional({ type: Boolean })
    @IsOptional()
    @Transform(toBoolean)
    @IsBoolean()
    isApplied?: boolean;

    @ApiPropertyOptional({ enum: APPLY_MEDIUMS })
    @IsOptional()
    @IsIn(APPLY_MEDIUMS)
    applyMedium?: ApplyMedium;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    deadlineFrom?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    deadlineTo?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    appliedFrom?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    appliedTo?: Date;

    @ApiPropertyOptional({ description: 'Salary range must reach at least this amount' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    salaryMin?: number;

    @ApiPropertyOptional({ description: 'Salary range must start at or below this amount' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    salaryMax?: number;

    @ApiPropertyOptional({ type: Boolean, description: 'Not applied yet and deadline has not passed' })
    @IsOptional()
    @Transform(toBoolean)
    @IsBoolean()
    upcoming?: boolean;

    @ApiPropertyOptional({ type: Boolean, description: 'Not applied and deadline has passed' })
    @IsOptional()
    @Transform(toBoolean)
    @IsBoolean()
    expired?: boolean;
}
