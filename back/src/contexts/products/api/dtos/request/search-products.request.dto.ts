import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProductsRequestDto {
    @ApiProperty({ example: 'camiseta', description: 'Text to search in product title/description' })
    @IsString()
    @MinLength(1)
    readonly query: string;

    @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly page?: number;

    @ApiPropertyOptional({ example: 10, description: 'Items per page' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly limit?: number;
}
