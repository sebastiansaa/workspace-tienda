import { Prisma, Category as PrismaCategory } from "@prisma/client";
import { CategoryEntity } from "../../domain/entity/category.entity";

export class CategoryMapper {
    static toDomain(raw: PrismaCategory): CategoryEntity {
        return CategoryEntity.rehydrate({
            id: raw.id,
            title: raw.title,
            slug: raw.slug,
            image: raw.image,
            description: raw.description ?? undefined,
            active: raw.active,
            sortOrder: raw.sortOrder,
            deletedAt: raw.deletedAt,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        });
    }

    static toPersistence(entity: CategoryEntity): Prisma.CategoryUncheckedCreateInput {
        return {
            id: entity.id,
            title: entity.title,
            slug: entity.slug,
            image: entity.image,
            description: entity.description ?? null,
            active: entity.active,
            sortOrder: entity.sortOrder,
            deletedAt: entity.deletedAt ?? null,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
