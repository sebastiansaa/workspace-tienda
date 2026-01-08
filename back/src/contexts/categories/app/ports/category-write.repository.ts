import { CategoryEntity } from "../../domain/entity/category.entity";

export interface ICategoryWriteRepository {
    save(category: CategoryEntity): Promise<CategoryEntity>;
    delete(id: number): Promise<void>;
}
