import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class OrderItemDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsPositive()
    productId: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @IsPositive()
    quantity: number;
}
