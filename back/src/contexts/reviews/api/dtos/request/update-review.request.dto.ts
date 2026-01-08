import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class UpdateReviewRequestDto {
    @ApiProperty({ minimum: 1, maximum: 5, example: 4 })
    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;

    @ApiProperty({ example: 'Actualizo mi comentario tras más uso' })
    @IsString()
    @IsNotEmpty()
    comment!: string;
}

export default UpdateReviewRequestDto;
