import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
    @ApiProperty({ example: 'ada@example.com' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: 'S3guro!2024' })
    @IsString()
    @MinLength(8)
    readonly password: string;
}
