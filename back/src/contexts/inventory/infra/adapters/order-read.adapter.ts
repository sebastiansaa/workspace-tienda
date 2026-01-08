import { Injectable } from '@nestjs/common';
import OrderReadOnlyPort from '../../app/ports/order-read.port';

@Injectable()
export class OrderReadOnlyAdapter implements OrderReadOnlyPort {
    async findById(): Promise<unknown> {
        return null;
    }
}

export default OrderReadOnlyAdapter;
