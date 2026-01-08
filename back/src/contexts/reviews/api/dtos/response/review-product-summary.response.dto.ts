import { ApiProperty } from '@nestjs/swagger';

export class ReviewProductSummaryResponseDto {
    @ApiProperty({ example: 4.5 })
    averageRating!: number;

    @ApiProperty({ example: 128 })
    totalReviews!: number;
}

export default ReviewProductSummaryResponseDto;
