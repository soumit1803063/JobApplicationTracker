import { applyDecorators, HttpStatus } from '@nestjs/common';
import type { Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationMetaDto } from '../dto/pagination-meta.dto.js';

type Decorator = ReturnType<typeof applyDecorators>;

const successFlag = { type: 'boolean', example: true };

// Swagger docs for { success: true, data: <model> }
export function ApiSuccessResponse(model: Type<unknown>, status: HttpStatus = HttpStatus.OK): Decorator
{
    return applyDecorators(
        ApiExtraModels(model),
        ApiResponse({
            status,
            schema: {
                type: 'object',
                required: ['success', 'data'],
                properties: { success: successFlag, data: { $ref: getSchemaPath(model) } },
            },
        }),
    );
}

// Swagger docs for { success: true, data: <model>[], meta: PaginationMeta }
export function ApiPaginatedResponse(model: Type<unknown>): Decorator
{
    return applyDecorators(
        ApiExtraModels(model, PaginationMetaDto),
        ApiResponse({
            status: HttpStatus.OK,
            schema: {
                type: 'object',
                required: ['success', 'data', 'meta'],
                properties: {
                    success: successFlag,
                    data: { type: 'array', items: { $ref: getSchemaPath(model) } },
                    meta: { $ref: getSchemaPath(PaginationMetaDto) },
                },
            },
        }),
    );
}
