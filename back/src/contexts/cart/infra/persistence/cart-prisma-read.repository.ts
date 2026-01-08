import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICartReadRepository } from '../../app/ports/cart-read.repository';
import { CartEntity } from '../../domain/entity/cart.entity';
import { prismaToCartEntity } from '../mappers/cart-prisma.mapper';

@Injectable()
export class CartPrismaReadRepository implements ICartReadRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByUserId(userId: string): Promise<CartEntity | null> {
        const found = await this.prisma.cart.findUnique({ where: { userId } });
        return prismaToCartEntity(found);
    }
}
