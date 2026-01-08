import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from '../dtos';
import { CreateCategoryCommand } from '../../app/commands/create-category.command';
import { UpdateCategoryCommand } from '../../app/commands/update-category.command';
import { CategoryEntity } from '../../domain/entity/category.entity';

export class CategoryApiMapper {
    static toCreateCommand(dto: CreateCategoryDto): CreateCategoryCommand {
        return new CreateCategoryCommand(
            dto.title,
            dto.slug,
            dto.image ?? '',
            dto.description ?? '',
            dto.active,
            dto.sortOrder,
        );
    }

    static toUpdateCommand(id: number, dto: UpdateCategoryDto): UpdateCategoryCommand {
        return new UpdateCategoryCommand(id, dto.title, dto.slug, dto.image, dto.description, dto.active, dto.sortOrder);
    }

    static toResponseDto(entity: CategoryEntity): CategoryResponseDto {
        return {
            id: entity.id!,
            title: entity.title,
            slug: entity.slug,
            image: entity.image,
            description: entity.description ?? '',
            active: entity.active,
            sortOrder: entity.sortOrder,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
            deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
        };
    }

    static toResponseList(entities: CategoryEntity[]): CategoryResponseDto[] {
        return entities.map((e) => this.toResponseDto(e));
    }
}

export default CategoryApiMapper;
