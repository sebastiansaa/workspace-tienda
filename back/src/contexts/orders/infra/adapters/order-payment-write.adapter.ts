import { Inject, Injectable } from '@nestjs/common';
import { ORDER_WRITE_REPOSITORY } from '../../constants';
import type { IOrderWriteRepository } from '../../app/ports/order-write.repository';
import { OrderEntity } from '../../domain/entity/order.entity';
import type OrderPaymentWritePort from '../../../shared/ports/order-payment-write.port';

@Injectable()
export class OrderPaymentWriteAdapter implements OrderPaymentWritePort {
    constructor(
        @Inject(ORDER_WRITE_REPOSITORY)
        private readonly orderWriteRepo: IOrderWriteRepository,
    ) { }

    async createCheckoutOrder(input: { userId: string; totalAmount: number; items?: { productId: number; quantity: number; price: number; }[]; }) {
        const items = (input.items ?? []).map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));

        if (items.length === 0) {
            throw new Error('Checkout order requires at least one item');
        }

        const expectedTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        if (expectedTotal !== input.totalAmount) {
            throw new Error('Checkout order amount mismatch');
        }

        const order = OrderEntity.create({
            userId: input.userId,
            status: 'PENDING',
            items,
        });
        const saved = await this.orderWriteRepo.save(order);
        return {
            id: saved.id,
            userId: saved.userId,
            totalAmount: saved.totalAmount,
        };
    }
}

export default OrderPaymentWriteAdapter;