import { ICategoryReadRepository } from "../ports/category-read.repository";
import { ICategoryWriteRepository } from "../ports/category-write.repository";
import { CategoryNotFoundError } from "../../domain/errors/category.errors";

export class DeleteCategoryUseCase {
    constructor(
        private readonly readRepo: ICategoryReadRepository,
        private readonly writeRepo: ICategoryWriteRepository
    ) { }

    async execute(id: number): Promise<void> {
        const existing = await this.readRepo.findById(id);
        if (!existing) throw new CategoryNotFoundError(`Category with id ${id} not found`);

        await this.writeRepo.delete(id);
    }
}
