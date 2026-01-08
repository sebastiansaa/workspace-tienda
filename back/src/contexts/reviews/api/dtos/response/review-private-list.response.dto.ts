import { ApiProperty } from '@nestjs/swagger';
import { ReviewPrivateResponseDto } from './review-private.response.dto';

export class ReviewPrivateListResponseDto {
    @ApiProperty({ type: [ReviewPrivateResponseDto] })
    reviews!: ReviewPrivateResponseDto[];

    @ApiProperty({ example: 12 })
    total!: number;
}

export default ReviewPrivateListResponseDto;
