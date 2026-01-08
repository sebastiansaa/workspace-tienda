import { CreateCategoryCommand } from "../commands/create-category.command";
import { ICategoryReadRepository } from "../ports/category-read.repository";
import { ICategoryWriteRepository } from "../ports/category-write.repository";
import { CategoryEntity } from "../../domain/entity/category.entity";
import { DuplicateCategoryError } from "../../domain/errors/category.errors";

export class CreateCategoryUseCase {
    constructor(
        private readonly readRepo: ICategoryReadRepository,
        private readonly writeRepo: ICategoryWriteRepository
    ) { }

    async execute(command: CreateCategoryCommand): Promise<CategoryEntity> {
        const existing = await this.readRepo.findBySlug(command.slug);
        if (existing) throw new DuplicateCategoryError(`Category with slug ${command.slug} already exists`);

        const entity = CategoryEntity.create({
            title: command.title,
            slug: command.slug,
            image: command.image,
            description: command.description,
            active: command.active,
            sortOrder: command.sortOrder
        });

        return this.writeRepo.save(entity);
    }
}
