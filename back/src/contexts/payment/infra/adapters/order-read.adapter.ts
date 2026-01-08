import { Inject, Injectable } from '@nestjs/common';
import { ORDER_PAYMENT_READ_PORT } from '../../../orders/constants';
import type OrderPaymentReadPort from '../../../shared/ports/order-payment-read.port';
import OrderReadOnlyPort from '../../app/ports/order-read.port';

@Injectable()
export class PaymentOrderReadAdapter implements OrderReadOnlyPort {
    constructor(
        @Inject(ORDER_PAYMENT_READ_PORT)
        private readonly delegate: OrderPaymentReadPort,
    ) { }

    async findById(orderId: string): Promise<{ id: string; userId: string; totalAmount: number } | null> {
        return this.delegate.findById(orderId);
    }
}

export default PaymentOrderReadAdapter;
