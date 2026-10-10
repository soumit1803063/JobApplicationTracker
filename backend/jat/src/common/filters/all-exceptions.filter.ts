import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ErrorResponseBody } from '../types/response.types.js';
import { getPrismaErrorCode } from '../utils/prisma-error.util.js';

type ResolvedError = ErrorResponseBody['error'];

// Turns every thrown error into the same shape:
//   { success: false, error: { statusCode, message, details? }, path, timestamp }
@Catch()
export class AllExceptionsFilter implements ExceptionFilter
{
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void
    {
        const http = host.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        const error = this.resolve(exception);
        if (error.statusCode >= 500)
        {
            this.logger.error(exception);
        }

        const body: ErrorResponseBody = {
            success: false,
            error,
            path: request.url,
            timestamp: new Date().toISOString(),
        };
        response.status(error.statusCode).json(body);
    }

    private resolve(exception: unknown): ResolvedError
    {
        if (exception instanceof HttpException)
        {
            const statusCode = exception.getStatus();
            const body = exception.getResponse();
            const message = typeof body === 'object' && 'message' in body ? body.message : undefined;

            // ValidationPipe puts a list of messages in `message`.
            if (Array.isArray(message))
            {
                return { statusCode, message: 'Validation failed', details: message.map(String) };
            }
            return { statusCode, message: typeof message === 'string' ? message : exception.message };
        }

        // Safety net for database constraint errors that slipped past the services.
        switch (getPrismaErrorCode(exception))
        {
            case 'P2002':
                return { statusCode: HttpStatus.CONFLICT, message: 'Resource already exists' };
            case 'P2025':
                return { statusCode: HttpStatus.NOT_FOUND, message: 'Resource not found' };
            default:
                return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' };
        }
    }
}
