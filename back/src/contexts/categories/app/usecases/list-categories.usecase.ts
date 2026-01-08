import { ICategoryReadRepository } from "../ports/category-read.repository";
import { CategoryEntity } from "../../domain/entity/category.entity";

export class ListCategoriesUseCase {
    constructor(private readonly repo: ICategoryReadRepository) { }

    async execute(): Promise<CategoryEntity[]> {
        return this.repo.findAll();
    }
}
