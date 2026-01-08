import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_READONLY } from '../../../products/constants';
import type { ProductReadOnlyPort as SharedProductReadOnlyPort } from '../../../shared/ports/product.readonly.repository';
import ProductReadOnlyPort, { ProductSnapshot } from '../../app/ports/product-read.port';

@Injectable()
export class ProductReadOnlyAdapter implements ProductReadOnlyPort {
    constructor(
        @Inject(PRODUCT_READONLY)
        private readonly productReadRepo: SharedProductReadOnlyPort,
    ) { }

    async findById(productId: number): Promise<ProductSnapshot | null> {
        if (!this.productReadRepo?.findDtoById) return null;
        const dto = await this.productReadRepo.findDtoById(productId);
        if (!dto) return null;
        return {
            id: dto.id,
            price: dto.price,
            stock: dto.stock,
        };
    }
}

export default ProductReadOnlyAdapter;
