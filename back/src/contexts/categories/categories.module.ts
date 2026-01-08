import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CategoriesController } from './api/controller/categories.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaCategoryWriteRepository } from './infra/persistence/prisma-category-write.repository';
import { PrismaCategoryReadRepository } from './infra/persistence/prisma-category-read.repository';
import { CATEGORY_READ_REPOSITORY, CATEGORY_WRITE_REPOSITORY } from './constants';
import {
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    DeleteCategoryUseCase
} from './app/usecases';
import { ICategoryReadRepository } from './app/ports/category-read.repository';
import { ICategoryWriteRepository } from './app/ports/category-write.repository';
import { CategorySharedAdapter } from './infra/adapters/category-shared.adapter';

@Module({
    imports: [AuthModule],
    controllers: [CategoriesController],
    providers: [
        PrismaService,
        {
            provide: CATEGORY_WRITE_REPOSITORY,
            useClass: PrismaCategoryWriteRepository,
        },
        {
            provide: CATEGORY_READ_REPOSITORY,
            useClass: PrismaCategoryReadRepository,
        },
        {
            provide: 'CategoryReadOnlyPort',
            useClass: CategorySharedAdapter,
        },
        {
            provide: CreateCategoryUseCase,
            useFactory: (read: ICategoryReadRepository, write: ICategoryWriteRepository) => new CreateCategoryUseCase(read, write),
            inject: [CATEGORY_READ_REPOSITORY, CATEGORY_WRITE_REPOSITORY],
        },
        {
            provide: UpdateCategoryUseCase,
            useFactory: (read: ICategoryReadRepository, write: ICategoryWriteRepository) => new UpdateCategoryUseCase(read, write),
            inject: [CATEGORY_READ_REPOSITORY, CATEGORY_WRITE_REPOSITORY],
        },
        {
            provide: GetCategoryUseCase,
            useFactory: (repo: ICategoryReadRepository) => new GetCategoryUseCase(repo),
            inject: [CATEGORY_READ_REPOSITORY],
        },
        {
            provide: ListCategoriesUseCase,
            useFactory: (repo: ICategoryReadRepository) => new ListCategoriesUseCase(repo),
            inject: [CATEGORY_READ_REPOSITORY],
        },
        {
            provide: DeleteCategoryUseCase,
            useFactory: (read: ICategoryReadRepository, write: ICategoryWriteRepository) => new DeleteCategoryUseCase(read, write),
            inject: [CATEGORY_READ_REPOSITORY, CATEGORY_WRITE_REPOSITORY],
        },
    ],
    exports: [CATEGORY_WRITE_REPOSITORY, CATEGORY_READ_REPOSITORY, 'CategoryReadOnlyPort', CreateCategoryUseCase, UpdateCategoryUseCase, DeleteCategoryUseCase]
})
export class CategoriesModule { }
