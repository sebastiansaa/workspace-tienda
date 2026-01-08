import { CategoryEntity } from "../../domain/entity/category.entity";

export interface ICategoryReadRepository {
    findById(id: number): Promise<CategoryEntity | null>;
    findBySlug(slug: string): Promise<CategoryEntity | null>;
    findAll(): Promise<CategoryEntity[]>;
}
