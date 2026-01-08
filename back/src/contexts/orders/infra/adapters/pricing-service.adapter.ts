import { Inject, Injectable } from '@nestjs/common';
import { ORDER_PRODUCT_READONLY } from '../../constants';
import PricingServicePort from '../../app/ports/pricing.service.port';
import type ProductReadOnlyPort from '../../app/ports/product-read.port';

@Injectable()
export class PricingServiceAdapter implements PricingServicePort {
    constructor(
        @Inject(ORDER_PRODUCT_READONLY)
        private readonly productRead: ProductReadOnlyPort,
    ) { }

    async getPrice(productId: number): Promise<number | null> {
        const product = await this.productRead.findById(productId);
        return product?.price ?? null;
    }
}

export default PricingServiceAdapter;
