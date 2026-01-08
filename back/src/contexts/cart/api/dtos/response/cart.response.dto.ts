import { ApiProperty } from '@nestjs/swagger';
import { CartItemResponseDto } from './cart-item.response.dto';

export class CartResponseDto {
    @ApiProperty({ example: 'cart-uuid' })
    id: string;

    @ApiProperty({ example: 'user-uuid' })
    userId: string;

    @ApiProperty({ type: [CartItemResponseDto] })
    items: CartItemResponseDto[];

    @ApiProperty({ example: 59.99 })
    total: number;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updatedAt: string;
}
