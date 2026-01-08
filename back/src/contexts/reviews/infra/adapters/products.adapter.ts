import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_VALIDATION_PORT } from '../../../products/constants';
import type ProductValidationPort from '../../../shared/ports/product-validation.port';
import { ProductsPort } from '../../app/ports';

@Injectable()
export class ReviewsProductsAdapter implements ProductsPort {
    constructor(
        @Inject(PRODUCT_VALIDATION_PORT)
        private readonly productValidation: ProductValidationPort,
    ) { }

    async ensureProductExists(productId: number): Promise<void> {
        await this.productValidation.ensureProductIsReviewable(productId);
    }
}

export default ReviewsProductsAdapter;
