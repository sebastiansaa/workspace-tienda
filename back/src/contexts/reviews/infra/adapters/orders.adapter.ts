import { Inject, Injectable } from '@nestjs/common';
import { ORDER_PURCHASE_HISTORY_PORT } from '../../../orders/constants';
import type OrderPurchaseHistoryPort from '../../../shared/ports/order-purchase-history.port';
import { OrdersPort } from '../../app/ports';

@Injectable()
export class ReviewsOrdersAdapter implements OrdersPort {
    constructor(
        @Inject(ORDER_PURCHASE_HISTORY_PORT)
        private readonly purchaseHistory: OrderPurchaseHistoryPort,
    ) { }

    async hasUserPurchasedProduct(userId: string, productId: number): Promise<boolean> {
        return this.purchaseHistory.hasUserPurchasedProduct(userId, productId);
    }
}

export default ReviewsOrdersAdapter;
