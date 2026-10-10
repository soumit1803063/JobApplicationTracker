import { ApiProperty } from '@nestjs/swagger';
import type { PaginationMeta } from '../types/pagination.types.js';

// Swagger documentation only.
export class PaginationMetaDto implements PaginationMeta
{
    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    hasNext: boolean;

    @ApiProperty()
    hasPrev: boolean;
}
