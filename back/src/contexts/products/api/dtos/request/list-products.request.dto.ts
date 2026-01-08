import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListProductsRequestDto {
    @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly page?: number;

    @ApiPropertyOptional({ example: 20, description: 'Items per page' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly limit?: number;

    @ApiPropertyOptional({ example: 3, description: 'Category identifier to filter products' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly categoryId?: number;
}
