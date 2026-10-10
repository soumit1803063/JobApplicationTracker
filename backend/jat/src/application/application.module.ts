import { Module } from '@nestjs/common';
import { ApplicationController } from './controllers/application.controller.js';
import { ApplicationRepository } from './repositories/application.repository.js';
import { ApplicationService } from './services/application.service.js';

@Module({
    controllers: [ApplicationController],
    providers: [ApplicationRepository, ApplicationService],
})
export class ApplicationModule
{}
