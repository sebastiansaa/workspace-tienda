import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICategoryWriteRepository } from '../../app/ports/category-write.repository';
import { CategoryEntity } from '../../domain/entity/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class PrismaCategoryWriteRepository implements ICategoryWriteRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(category: CategoryEntity): Promise<CategoryEntity> {
        const data = CategoryMapper.toPersistence(category);
        const payload = { ...data, updatedAt: category.updatedAt };

        const record = category.id
            ? await this.prisma.category.update({ where: { id: category.id }, data: payload })
            : await this.prisma.category.create({ data: payload });

        return CategoryMapper.toDomain(record);
    }

    async delete(id: number): Promise<void> {
        await this.prisma.category.update({
            where: { id },
            data: { deletedAt: new Date(), active: false, updatedAt: new Date() },
        });
    }
}
