import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
    @ApiProperty({ example: 'ada@example.com', description: 'User email' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: 'S3guro!2024', description: 'Password (min 8 chars)' })
    @IsString()
    @MinLength(8)
    readonly password: string;
}
