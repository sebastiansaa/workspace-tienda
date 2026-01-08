import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
    @ApiProperty({ example: 1 })
    productId: number;

    @ApiProperty({ example: 2 })
    quantity: number;

    @ApiProperty({ example: 19.99 })
    price: number;

    @ApiProperty({ example: 39.98 })
    lineTotal: number;
}
