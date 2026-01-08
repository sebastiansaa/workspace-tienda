import { ApiProperty } from '@nestjs/swagger';
import { ReviewPublicResponseDto } from './review-public.response.dto';

export class ReviewPublicListResponseDto {
    @ApiProperty({ type: [ReviewPublicResponseDto] })
    reviews!: ReviewPublicResponseDto[];

    @ApiProperty({ example: 42 })
    total!: number;
}

export default ReviewPublicListResponseDto;
