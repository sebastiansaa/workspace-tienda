import { ApiProperty } from '@nestjs/swagger';
import type { OrderStatusType } from '../../../domain/v-o/order-status.vo';

export class OrderStatusDto {
    @ApiProperty({ enum: ['PENDING', 'PAID', 'CANCELLED', 'COMPLETED'], example: 'PAID' })
    status: OrderStatusType;
}
