import {
    Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../dtos/index';
import {
    GetCategoryUseCase,
    ListCategoriesUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
} from '../../app/usecases';
import { CategoryApiMapper } from '../mappers/category-api.mapper';
import { ResponseMessage } from '../../../shared/decorators/response-message.decorator';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infra/guards/roles.guard';
import { Roles } from '../../../auth/api/decorators/roles.decorator';

@ApiTags('categories')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly getUseCase: GetCategoryUseCase,
        private readonly listUseCase: ListCategoriesUseCase,
        private readonly createUseCase: CreateCategoryUseCase,
        private readonly updateUseCase: UpdateCategoryUseCase,
        private readonly deleteUseCase: DeleteCategoryUseCase,
    ) { }

    @Get()
    @ResponseMessage('Categories retrieved successfully')
    @ApiOperation({ summary: 'List all categories' })
    @ApiResponse({ status: 200, description: 'Categories retrieved successfully', type: [CategoryResponseDto] })
    async findAll(): Promise<CategoryResponseDto[]> {
        const entities = await this.listUseCase.execute();
        return CategoryApiMapper.toResponseList(entities);
    }

    @Get(':id')
    @ResponseMessage('Category details retrieved successfully')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({ status: 200, description: 'Category found', type: CategoryResponseDto })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<CategoryResponseDto> {
        const entity = await this.getUseCase.execute(id);
        return CategoryApiMapper.toResponseDto(entity);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ResponseMessage('Category created successfully')
    @ApiOperation({ summary: 'Crear categoría (admin)' })
    @ApiResponse({ status: 201, type: CategoryResponseDto })
    async create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
        const command = CategoryApiMapper.toCreateCommand(dto);
        const category = await this.createUseCase.execute(command);
        return CategoryApiMapper.toResponseDto(category);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ResponseMessage('Category updated successfully')
    @ApiOperation({ summary: 'Actualizar categoría (admin)' })
    @ApiResponse({ status: 200, type: CategoryResponseDto })
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
        const command = CategoryApiMapper.toUpdateCommand(id, dto);
        const category = await this.updateUseCase.execute(command);
        return CategoryApiMapper.toResponseDto(category);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ResponseMessage('Category deleted successfully')
    @ApiOperation({ summary: 'Eliminar categoría (admin)' })
    @ApiResponse({ status: 200, description: 'Categoría eliminada' })
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.deleteUseCase.execute(id);
    }
}