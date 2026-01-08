import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICartWriteRepository } from '../../app/ports/cart-write.repository';
import { CartEntity } from '../../domain/entity/cart.entity';
import { cartToPrisma, prismaToCartEntity } from '../mappers/cart-prisma.mapper';

@Injectable()
export class CartPrismaWriteRepository implements ICartWriteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(cart: CartEntity): Promise<CartEntity> {
        const data = cartToPrisma(cart);
        const upserted = await this.prisma.cart.upsert({
            where: { userId: data.userId },
            create: data,
            update: { items: data.items },
        });
        return prismaToCartEntity(upserted)!;
    }

    async clear(userId: string): Promise<void> {
        await this.prisma.cart.deleteMany({ where: { userId } });
    }
}
