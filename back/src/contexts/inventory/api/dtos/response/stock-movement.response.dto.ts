import { ApiProperty } from '@nestjs/swagger';

export class StockMovementResponseDto {
    @ApiProperty({ example: 'mov-uuid' })
    id: string;

    @ApiProperty({ example: 1 })
    productId: number;

    @ApiProperty({ enum: ['INCREASE', 'DECREASE', 'RESERVATION', 'RELEASE'], example: 'INCREASE' })
    type: string;

    @ApiProperty({ example: 'ORDER', description: 'Business reason for the movement' })
    reason: string;

    @ApiProperty({ example: 3 })
    quantity: number;

    @ApiProperty({ example: 100, description: 'On-hand after applying movement' })
    onHandAfter: number;

    @ApiProperty({ example: 5, description: 'Reserved after applying movement' })
    reservedAfter: number;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;
}
