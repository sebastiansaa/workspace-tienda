import { Injectable, Inject } from "@nestjs/common";
import { CategoryReadOnlyPort } from "../../../shared/ports/category-readonly.port";
import { CategoryReadDto } from "../../../shared/dtos/category.dto";
import type { ICategoryReadRepository } from "../../app/ports/category-read.repository";
import { CATEGORY_READ_REPOSITORY } from "../../constants";

@Injectable()
export class CategorySharedAdapter implements CategoryReadOnlyPort {
    constructor(
        @Inject(CATEGORY_READ_REPOSITORY) private readonly repo: ICategoryReadRepository
    ) { }

    async findById(id: number | string): Promise<CategoryReadDto | null> {
        const numericId = Number(id);
        if (isNaN(numericId)) return null;

        const entity = await this.repo.findById(numericId);
        if (!entity) return null;

        return {
            id: entity.id!,
            name: entity.title
        };
    }

    async findAll(): Promise<CategoryReadDto[]> {
        const entities = await this.repo.findAll();
        return entities.map(e => ({
            id: e.id!,
            name: e.title
        }));
    }
}
