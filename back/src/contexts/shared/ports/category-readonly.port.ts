import { CategoryReadDto } from '../dtos/category.dto';

export interface CategoryReadOnlyPort {
    findById(id: number | string): Promise<CategoryReadDto | null>;
    findAll?(): Promise<CategoryReadDto[]>;
}

export default CategoryReadOnlyPort;
