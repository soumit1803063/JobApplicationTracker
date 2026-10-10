import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import type { SuccessResponseBody } from '../types/response.types.js';
import { PaginatedResult } from '../utils/pagination.util.js';

// Wraps every controller return value in the same envelope:
//   { success: true, data }            for single items
//   { success: true, data, meta }      for PaginatedResult
@Injectable()
export class ResponseInterceptor implements NestInterceptor<unknown, SuccessResponseBody<unknown>>
{
    intercept(_context: ExecutionContext, next: CallHandler<unknown>): Observable<SuccessResponseBody<unknown>>
    {
        return next.handle().pipe(
            map((body: unknown): SuccessResponseBody<unknown> =>
                body instanceof PaginatedResult
                    ? { success: true, data: body.data, meta: body.meta }
                    : { success: true, data: body ?? null }
            ),
        );
    }
}
