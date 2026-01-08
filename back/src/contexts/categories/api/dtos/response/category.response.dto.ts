import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    slug: string;

    @ApiPropertyOptional()
    image?: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiProperty()
    active: boolean;

    @ApiProperty()
    sortOrder: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiPropertyOptional()
    deletedAt: string | null;
}
