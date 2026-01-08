import { Injectable } from '@nestjs/common';
import { CategoryAdminPort } from '../../../shared/ports/admin/category-admin.port';
import {
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
} from '../../app/usecases/index';
import { CategoryApiMapper } from '../../api/mappers/category-api.mapper';
import type { CreateCategoryDto } from '../../api/dtos/request/create-category.dto';
import type { UpdateCategoryDto } from '../../api/dtos/request/update-category.dto';
import type { CategoryResponseDto } from '../../api/dtos/response/category.response.dto';

@Injectable()
export class CategoryAdminAdapter implements CategoryAdminPort {
    constructor(
        private readonly createUseCase: CreateCategoryUseCase,
        private readonly updateUseCase: UpdateCategoryUseCase,
        private readonly deleteUseCase: DeleteCategoryUseCase,
    ) { }

    async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
        const command = CategoryApiMapper.toCreateCommand(dto);
        const category = await this.createUseCase.execute(command);
        return CategoryApiMapper.toResponseDto(category);
    }

    async update(id: number, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        const command = CategoryApiMapper.toUpdateCommand(id, dto);
        const category = await this.updateUseCase.execute(command);
        return CategoryApiMapper.toResponseDto(category);
    }

    async delete(id: number): Promise<void> {
        await this.deleteUseCase.execute(id);
    }
}
