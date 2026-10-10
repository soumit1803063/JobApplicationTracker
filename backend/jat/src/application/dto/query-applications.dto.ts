import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import type { TransformFnParams } from 'class-transformer';
import { IsBoolean, IsDate, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import {
  APPLICATION_SORT_FIELDS,
  ApplyMedium,
  SORT_ORDERS,
} from '../application.types.js';
import type { ApplicationListQuery, ApplicationSortField, SortOrder } from '../application.types.js';

// Query strings are always strings: turn "true"/"false" into real booleans.
const toBoolean = ({ value }: TransformFnParams): unknown =>
  value === 'true' ? true : value === 'false' ? false : value;

export class QueryApplicationsDto implements ApplicationListQuery {
  // ---- Pagination ----
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

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

  @ApiPropertyOptional({ enum: Object.values(ApplyMedium) })
  @IsOptional()
  @IsIn(Object.values(ApplyMedium))
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
