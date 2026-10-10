import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { HealthStatus } from './health.types.js';

@ApiTags('health')
@Controller('health')
export class HealthController
{
    @Get()
    check(): HealthStatus
    {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
}
