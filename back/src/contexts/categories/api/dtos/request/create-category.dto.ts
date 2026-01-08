import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    slug: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    image?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    sortOrder?: number;
}
