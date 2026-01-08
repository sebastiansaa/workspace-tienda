import { ApiProperty } from '@nestjs/swagger';

export class StockResponseDto {
    @ApiProperty({ example: 1, description: 'Product identifier' })
    productId: number;

    @ApiProperty({ example: 100, description: 'Units physically available' })
    onHand: number;

    @ApiProperty({ example: 10, description: 'Units reserved for orders' })
    reserved: number;

    @ApiProperty({ example: 90, description: 'Units available = onHand - reserved' })
    available: number;
}
