import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_READONLY } from '../../constants';
import type { IProductReadRepository } from '../../app/ports';
import type ProductValidationPort from '../../../shared/ports/product-validation.port';

@Injectable()
export class ProductValidationService implements ProductValidationPort {
    constructor(
        @Inject(PRODUCT_READONLY)
        private readonly productReadRepo: IProductReadRepository,
    ) { }

    async ensureProductIsReviewable(productId: number): Promise<void> {
        const product = await this.productReadRepo.findById(productId);
        if (!product) throw new NotFoundException('Product not available');
        if (!product.active) throw new NotFoundException('Product not available');
    }
}

export default ProductValidationService;