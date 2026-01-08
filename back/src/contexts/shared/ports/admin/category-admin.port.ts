import type { CreateCategoryDto } from '../../../categories/api/dtos/request/create-category.dto';
import type { UpdateCategoryDto } from '../../../categories/api/dtos/request/update-category.dto';
import type { CategoryResponseDto } from '../../../categories/api/dtos/response/category.response.dto';

export interface CategoryAdminPort {
    create(dto: CreateCategoryDto): Promise<CategoryResponseDto>;
    update(id: number, dto: UpdateCategoryDto): Promise<CategoryResponseDto>;
    delete(id: number): Promise<void>;
}
