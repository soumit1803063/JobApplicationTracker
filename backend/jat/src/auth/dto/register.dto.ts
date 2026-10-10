import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { toTrimmedLowerCase } from '../../common/utils/transform.util.js';

export class RegisterDto
{
    @ApiProperty({ example: 'john@example.com' })
    @Transform(toTrimmedLowerCase)
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'StrongPass123', minLength: 8 })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;
}
