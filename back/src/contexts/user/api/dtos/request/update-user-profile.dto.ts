import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsPhoneNumber, IsObject } from 'class-validator';

export class UpdateUserProfileDto {
    @ApiPropertyOptional({ example: 'Ada Lovelace' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: '+34123456789' })
    @IsOptional()
    @IsPhoneNumber('ES')
    phone?: string;

    @ApiPropertyOptional({ example: { theme: 'dark' } })
    @IsOptional()
    @IsObject()
    preferences?: Record<string, unknown>;
}
