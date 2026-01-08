import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ICategoryReadRepository } from '../../app/ports/category-read.repository';
import { CategoryEntity } from '../../domain/entity/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class PrismaCategoryReadRepository implements ICategoryReadRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: number): Promise<CategoryEntity | null> {
        const found = await this.prisma.category.findUnique({ where: { id } });
        return found ? CategoryMapper.toDomain(found) : null;
    }

    async findBySlug(slug: string): Promise<CategoryEntity | null> {
        const found = await this.prisma.category.findUnique({ where: { slug } });
        return found ? CategoryMapper.toDomain(found) : null;
    }

    async findAll(): Promise<CategoryEntity[]> {
        const found = await this.prisma.category.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } });
        return found.map(CategoryMapper.toDomain);
    }
}
