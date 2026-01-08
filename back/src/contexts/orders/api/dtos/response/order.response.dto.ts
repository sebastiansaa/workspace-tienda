import { ApiProperty } from '@nestjs/swagger';
import { OrderItemResponseDto } from './order-item.response.dto';
import type { OrderStatusType } from '../../../domain/v-o/order-status.vo';

export class OrderResponseDto {
    @ApiProperty({ example: 'order-uuid' })
    id: string;

    @ApiProperty({ example: 'user-uuid' })
    userId: string;

    @ApiProperty({ enum: ['PENDING', 'PAID', 'CANCELLED', 'COMPLETED'], example: 'PENDING' })
    status: OrderStatusType;

    @ApiProperty({ example: 59.99 })
    totalAmount: number;

    @ApiProperty({ type: [OrderItemResponseDto] })
    items: OrderItemResponseDto[];

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-01-02T00:00:00.000Z' })
    updatedAt: string;
}
