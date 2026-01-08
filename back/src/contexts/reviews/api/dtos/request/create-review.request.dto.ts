import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, Max, Min } from 'class-validator';

export class CreateReviewRequestDto {
    @ApiProperty({ example: 101 })
    @IsInt()
    @IsPositive()
    productId!: number;

    @ApiProperty({ minimum: 1, maximum: 5, example: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;

    @ApiProperty({ example: 'Excelente calidad y entrega rápida' })
    @IsString()
    @IsNotEmpty()
    comment!: string;
}

export default CreateReviewRequestDto;
