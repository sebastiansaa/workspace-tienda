import { ApiProperty } from '@nestjs/swagger';

export class ReviewPrivateResponseDto {
    @ApiProperty({ format: 'uuid' })
    id!: string;

    @ApiProperty({ example: 101 })
    productId!: number;

    @ApiProperty({ example: 5 })
    rating!: number;

    @ApiProperty({ example: 'Excelente calidad y entrega rápida' })
    comment!: string;

    @ApiProperty({ type: String })
    createdAt!: Date;

    @ApiProperty({ format: 'uuid', required: false, nullable: true })
    userId?: string;
}

export default ReviewPrivateResponseDto;
