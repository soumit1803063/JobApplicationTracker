import { PartialType } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-application.dto.js';

// Every field optional. Omitted = keep current value; null = clear it.
export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}
