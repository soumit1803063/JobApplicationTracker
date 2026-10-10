import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller.js';
import { ApplicationRepository } from './application.repository.js';
import { ApplicationService } from './application.service.js';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationRepository, ApplicationService],
})
export class ApplicationModule {}
