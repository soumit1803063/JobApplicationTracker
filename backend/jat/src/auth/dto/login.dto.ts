import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { toTrimmedLowerCase } from '../../common/utils/transform.util.js';

export class LoginDto
{
    @ApiProperty({ example: 'john@example.com' })
    @Transform(toTrimmedLowerCase)
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'StrongPass123' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
