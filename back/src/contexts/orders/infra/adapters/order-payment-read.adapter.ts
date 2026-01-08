import { Inject, Injectable } from '@nestjs/common';
import { ORDER_READ_REPOSITORY } from '../../constants';
import type { IOrderReadRepository } from '../../app/ports/order-read.repository';
import type OrderPaymentReadPort from '../../../shared/ports/order-payment-read.port';

@Injectable()
export class OrderPaymentReadAdapter implements OrderPaymentReadPort {
    constructor(
        @Inject(ORDER_READ_REPOSITORY)
        private readonly orderReadRepo: IOrderReadRepository,
    ) { }

    async findById(orderId: string) {
        const entity = await this.orderReadRepo.findById(orderId);
        if (!entity) return null;
        return {
            id: entity.id,
            userId: entity.userId,
            totalAmount: entity.totalAmount,
        };
    }
}

export default OrderPaymentReadAdapter;