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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard.js';
import type { AuthUser } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { ApplicationService } from './application.service.js';
import type { JobApplication, Paginated } from './application.types.js';
import {
  ApplicationResponseDto,
  PaginatedApplicationsResponseDto,
} from './dto/application-response.dto.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { QueryApplicationsDto } from './dto/query-applications.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @ApiCreatedResponse({ type: ApplicationResponseDto })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateApplicationDto): Promise<JobApplication> {
    return this.applicationService.create(user.id, dto);
  }

  @Get()
  @ApiOkResponse({ type: PaginatedApplicationsResponseDto })
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: QueryApplicationsDto,
  ): Promise<Paginated<JobApplication>> {
    return this.applicationService.findAll(user.id, query);
  }

  @Get(':id')
  @ApiOkResponse({ type: ApplicationResponseDto })
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JobApplication> {
    return this.applicationService.findOne(user.id, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ApplicationResponseDto })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
  ): Promise<JobApplication> {
    return this.applicationService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@CurrentUser() user: AuthUser, @Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.applicationService.remove(user.id, id);
  }
}
