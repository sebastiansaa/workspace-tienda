import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_READONLY } from '../../../products/constants';
import PricingServicePort from '../../app/ports/pricing-service.port';
import type { ProductReadOnlyPort } from '../../../shared/ports/product.readonly.repository';

@Injectable()
export class CartPricingService implements PricingServicePort {
    constructor(
        @Inject(PRODUCT_READONLY)
        private readonly productReadRepo: ProductReadOnlyPort,
    ) { }

    async getPrice(productId: number): Promise<number | null> {
        if (!this.productReadRepo?.findDtoById) return null;
        const product = await this.productReadRepo.findDtoById(productId);
        return product?.price ?? null;
    }
}

export default CartPricingService;