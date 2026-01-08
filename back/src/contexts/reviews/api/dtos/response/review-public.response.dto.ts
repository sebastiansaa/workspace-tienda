import { ApiProperty } from '@nestjs/swagger';

export class ReviewPublicResponseDto {
    @ApiProperty({ example: 5 })
    rating!: number;

    @ApiProperty({ example: 'Excelente calidad y entrega rápida' })
    comment!: string;

    @ApiProperty({ type: String })
    createdAt!: Date;
}

export default ReviewPublicResponseDto;
