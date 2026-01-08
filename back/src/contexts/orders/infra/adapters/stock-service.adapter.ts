import { Inject, Injectable } from '@nestjs/common';
import { ORDER_PRODUCT_READONLY } from '../../constants';
import StockServicePort from '../../app/ports/stock.service.port';
import type ProductReadOnlyPort from '../../app/ports/product-read.port';

@Injectable()
export class StockServiceAdapter implements StockServicePort {
    constructor(
        @Inject(ORDER_PRODUCT_READONLY)
        private readonly productRead: ProductReadOnlyPort,
    ) { }

    async isAvailable(productId: number, quantity: number): Promise<boolean> {
        const product = await this.productRead.findById(productId);
        if (!product) return false;
        return product.stock >= quantity;
    }
}

export default StockServiceAdapter;
