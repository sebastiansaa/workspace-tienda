import { ICategoryReadRepository } from "../ports/category-read.repository";
import { CategoryEntity } from "../../domain/entity/category.entity";
import { CategoryNotFoundError } from "../../domain/errors/category.errors";

export class GetCategoryUseCase {
    constructor(private readonly repo: ICategoryReadRepository) { }

    async execute(id: number): Promise<CategoryEntity> {
        const existing = await this.repo.findById(id);
        if (!existing) throw new CategoryNotFoundError(`Category with id ${id} not found`);
        return existing;
    }
}
