import { Inject, Injectable } from '@nestjs/common';
import { ORDER_PAYMENT_WRITE_PORT } from '../../../orders/constants';
import type OrderPaymentWritePort from '../../../shared/ports/order-payment-write.port';
import OrderWritePort, { OrderWriteItem } from '../../app/ports/order-write.port';


@Injectable()
export class PaymentOrderWriteAdapter implements OrderWritePort {
    constructor(
        @Inject(ORDER_PAYMENT_WRITE_PORT)
        private readonly delegate: OrderPaymentWritePort,
    ) { }

    async createCheckoutOrder(input: { userId: string; totalAmount: number; items?: OrderWriteItem[] }) {
        return this.delegate.createCheckoutOrder(input);
    }
}

export default PaymentOrderWriteAdapter;
