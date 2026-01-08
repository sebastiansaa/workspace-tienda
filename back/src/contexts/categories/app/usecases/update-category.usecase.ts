import { UpdateCategoryCommand } from "../commands/update-category.command";
import { ICategoryReadRepository } from "../ports/category-read.repository";
import { ICategoryWriteRepository } from "../ports/category-write.repository";
import { CategoryEntity } from "../../domain/entity/category.entity";
import { CategoryNotFoundError, DuplicateCategoryError } from "../../domain/errors/category.errors";

export class UpdateCategoryUseCase {
    constructor(
        private readonly readRepo: ICategoryReadRepository,
        private readonly writeRepo: ICategoryWriteRepository
    ) { }

    async execute(command: UpdateCategoryCommand): Promise<CategoryEntity> {
        const existing = await this.readRepo.findById(command.id);
        if (!existing) throw new CategoryNotFoundError(`Category with id ${command.id} not found`);

        if (command.slug && command.slug !== existing.slug) {
            const slugExists = await this.readRepo.findBySlug(command.slug);
            if (slugExists) throw new DuplicateCategoryError(`Category with slug ${command.slug} already exists`);
        }

        existing.update({
            title: command.title,
            slug: command.slug,
            image: command.image,
            description: command.description,
            sortOrder: command.sortOrder,
            active: command.active
        });

        return this.writeRepo.save(existing);
    }
}
