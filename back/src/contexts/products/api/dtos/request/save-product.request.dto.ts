import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsInt, Min, MinLength, IsUrl } from 'class-validator';

export class SaveProductRequestDto {
    @ApiPropertyOptional({ example: 101, description: 'Only when updating an existing product' })
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly id?: number;

    @ApiProperty({ example: 'Camiseta básica', description: 'Human readable name' })
    @IsString()
    @MinLength(1)
    readonly title: string;

    @ApiProperty({ example: 'camiseta-basica', description: 'URL-friendly slug' })
    @IsString()
    @MinLength(1)
    readonly slug: string;

    @ApiProperty({ example: 19.99, description: 'Unit price in the store currency' })
    @IsNumber()
    @Min(0)
    readonly price: number;

    @ApiPropertyOptional({ example: 'Camiseta 100% algodón', description: 'Detailed description' })
    @IsOptional()
    @IsString()
    readonly description?: string;

    @ApiPropertyOptional({ example: 50, description: 'Initial stock' })
    @IsOptional()
    @IsInt()
    @Min(0)
    readonly stock?: number;

    @ApiPropertyOptional({ example: true, description: 'Publish the product' })
    @IsOptional()
    @IsBoolean()
    readonly active?: boolean;

    @ApiProperty({ example: ['https://cdn.example.com/p1.jpg'], description: 'Image URLs', type: [String] })
    @IsArray()
    @IsString({ each: true })
    readonly images: string[];

    @ApiProperty({ example: 3, description: 'Category identifier' })
    @IsInt()
    @Min(1)
    readonly categoryId: number;
}
