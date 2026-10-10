import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiTags } from '@nestjs/swagger';
import { Authenticated } from '../../auth/decorators/authenticated.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../../auth/types/auth.types.js';
import { ApiPaginatedResponse, ApiSuccessResponse } from '../../common/decorators/api-response.decorator.js';
import type { PaginatedResult } from '../../common/utils/pagination.util.js';
import { ApplicationResponseDto } from '../dto/application-response.dto.js';
import { CreateApplicationDto } from '../dto/create-application.dto.js';
import { QueryApplicationsDto } from '../dto/query-applications.dto.js';
import { UpdateApplicationDto } from '../dto/update-application.dto.js';
import { ApplicationService } from '../services/application.service.js';
import type { JobApplication } from '../types/application.types.js';

@ApiTags('applications')
@Authenticated()
@Controller('applications')
export class ApplicationController
{
    constructor(private readonly applicationService: ApplicationService)
    {}

    @Post()
    @ApiSuccessResponse(ApplicationResponseDto, HttpStatus.CREATED)
    create(@CurrentUser() user: AuthUser, @Body() dto: CreateApplicationDto): Promise<JobApplication>
    {
        return this.applicationService.create(user.id, dto);
    }

    @Get()
    @ApiPaginatedResponse(ApplicationResponseDto)
    findAll(
        @CurrentUser() user: AuthUser,
        @Query() query: QueryApplicationsDto,
    ): Promise<PaginatedResult<JobApplication>>
    {
        return this.applicationService.findAll(user.id, query);
    }

    @Get(':id')
    @ApiSuccessResponse(ApplicationResponseDto)
    findOne(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string): Promise<JobApplication>
    {
        return this.applicationService.findOne(user.id, id);
    }

    @Patch(':id')
    @ApiSuccessResponse(ApplicationResponseDto)
    update(
        @CurrentUser() user: AuthUser,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateApplicationDto,
    ): Promise<JobApplication>
    {
        return this.applicationService.update(user.id, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse()
    remove(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string): Promise<void>
    {
        return this.applicationService.remove(user.id, id);
    }
}
