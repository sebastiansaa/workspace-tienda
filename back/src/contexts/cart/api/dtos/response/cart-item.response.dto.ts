import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartItemResponseDto {
    @ApiProperty({ example: 1 })
    productId: number;

    @ApiProperty({ example: 2 })
    quantity: number;

    @ApiPropertyOptional({ example: 19.99 })
    price?: number;

    @ApiProperty({ example: 39.98 })
    lineTotal: number;
}
