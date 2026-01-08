import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IProductWriteRepository } from '../../app/ports/product-write.repository';
import { ProductEntity } from '../../domain/entity';
import ProductPrismaMapper from '../mappers/product-prisma.mapper';
import { StockInsufficientError } from '../../domain/errors/stock.errors';

@Injectable()
// Repositorio Prisma para escritura/operaciones completas sobre `Product`.
// Nota: el contrato ligero de solo-lectura está implementado en `ProductPrismaReadRepository`.
export class ProductPrismaWriteRepository implements IProductWriteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(product: ProductEntity): Promise<ProductEntity> {
        // Si el producto tiene id lo consideramos flujo de actualización
        if (typeof product.id === 'number') {
            const exists = await this.prisma.product.findUnique({ where: { id: product.id } });
            if (exists) {
                const updated = await this.prisma.product.update({ where: { id: product.id }, data: ProductPrismaMapper.toUpdateInput(product) });
                const entity = ProductPrismaMapper.toDomain(updated);
                if (!entity) throw new Error('Failed to map updated product');
                return entity;
            }
        }

        // Flujo de creación: dejar que la BD genere el id
        const created = await this.prisma.product.create({ data: ProductPrismaMapper.toCreateInput(product) });
        const entity = ProductPrismaMapper.toDomain(created);
        if (!entity) throw new Error('Failed to map created product');
        return entity;
    }

    async deleteById(id: number, soft?: boolean): Promise<void> {
        if (soft === false) {
            await this.prisma.product.delete({ where: { id } });
            return;
        }
        // soft delete — set active false and mark deletedAt
        await this.prisma.product.update({ where: { id }, data: { active: false, deletedAt: new Date(), updatedAt: new Date() } });
    }

    async restoreById(id: number): Promise<ProductEntity> {
        const updated = await this.prisma.product.update({ where: { id }, data: { active: true, deletedAt: null, updatedAt: new Date() } });
        const entity = ProductPrismaMapper.toDomain(updated);
        if (!entity) throw new Error('Failed to map restored product');
        return entity;
    }

    async updateStock(id: number, quantity: number): Promise<ProductEntity> {
        const updated = await this.prisma.product.update({ where: { id }, data: { stock: quantity } });
        const entity = ProductPrismaMapper.toDomain(updated);
        if (!entity) throw new Error('Failed to map updated product stock');
        return entity;
    }

    async decrementStock(id: number, quantity: number): Promise<ProductEntity> {
        if (quantity <= 0) throw new Error('Quantity must be positive');

        // Ejecutamos la actualización y la lectura dentro de una transacción para
        // garantizar que la operación de decremento y la posterior lectura sean
        // consistentes entre sí. La actualización sigue usando la condición
        // `stock >= quantity` para evitar pasar a stock negativo.
        const [res, updated] = await this.prisma.$transaction([
            this.prisma.product.updateMany({ where: { id, stock: { gte: quantity } }, data: { stock: { decrement: quantity } } }),
            this.prisma.product.findUnique({ where: { id } }),
        ]);

        if (res.count === 0) {
            throw new StockInsufficientError();
        }

        const entity = ProductPrismaMapper.toDomain(updated);
        if (!entity) throw new Error('Failed to map product after decrement');
        return entity;
    }

}

export default ProductPrismaWriteRepository;
