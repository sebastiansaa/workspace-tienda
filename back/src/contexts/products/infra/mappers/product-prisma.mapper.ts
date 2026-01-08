import { Prisma } from '@prisma/client';
import { ProductEntity } from '../../domain/entity';
import { decimalToNumber, decimalToString } from '../helpers/decimal.helper';
import { buildProductCreateInput, buildProductUpdateInput } from '../helpers/product-prisma-inputs';
import { ProductReadDto } from '../../../shared/dtos/product.read.dto';

export class ProductPrismaMapper {
    static toDomain(row: Prisma.ProductGetPayload<true> | null | undefined): ProductEntity | null {
        if (!row) return null;

        const price = decimalToNumber(row.price);

        return ProductEntity.rehydrate({
            id: row.id,
            title: row.title,
            slug: row.slug,
            price,
            description: row.description,
            stock: row.stock,
            active: row.active,
            images: row.images,
            categoryId: row.categoryId,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            deletedAt: row.deletedAt ?? undefined,
        });
    }

    static toCreateInput(entity: ProductEntity): Prisma.ProductUncheckedCreateInput {
        return buildProductCreateInput(entity);
    }

    static toUpdateInput(entity: ProductEntity): Prisma.ProductUncheckedUpdateInput {
        return buildProductUpdateInput(entity);
    }

    static toReadDto(row: Prisma.ProductGetPayload<true> | null | undefined): ProductReadDto | null {
        if (!row) return null;
        const price = decimalToNumber(row.price);
        return {
            id: row.id,
            title: row.title,
            price,
            stock: row.stock,
            image: row.images && row.images.length > 0 ? row.images[0] : undefined,
            slug: row.slug ?? undefined,
        };
    }
}

export default ProductPrismaMapper;
