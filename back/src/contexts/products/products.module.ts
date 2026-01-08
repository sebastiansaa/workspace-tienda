import { Module } from '@nestjs/common';
import { ProductsController } from './api/controller/products.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoriesModule } from '../categories/categories.module';
import { AuthModule } from '../auth/auth.module';

import { IProductWriteRepository, IProductReadRepository } from './app/ports';
import { PRODUCT_WRITE, PRODUCT_READONLY, PRODUCT_VALIDATION_PORT } from './constants';

import { ProductPrismaWriteRepository, ProductPrismaReadRepository } from './infra/persistence';

import { ProductCategoryPolicy } from './app/policies/product-category.policy';
import { CategoryReadOnlyPort } from 'src/contexts/shared/ports/category-readonly.port';
import ProductValidationService from './infra/services/product-validation.service';

// Usecases
import {
  SaveProductUsecase,
  DeleteProductUsecase,
  RestoreProductUsecase,
  UpdateStockUsecase,
  FindProductByIdUsecase,
  ListProductsUsecase,
  FindLowStockUsecase,
  SearchProductsUsecase,
} from './app/usecases';
import { DecreaseStockUsecase } from './app/usecases/decrease-stock.usecase';

@Module({
  imports: [CategoriesModule, AuthModule],
  controllers: [ProductsController],
  providers: [
    // Infrastructure
    PrismaService,
    {
      provide: PRODUCT_WRITE,
      useClass: ProductPrismaWriteRepository,
    },
    {
      provide: PRODUCT_READONLY,
      useClass: ProductPrismaReadRepository,
    },
    {
      provide: PRODUCT_VALIDATION_PORT,
      useClass: ProductValidationService,
    },
    // Policy: valida existencia de categoría usando puerto compartido
    {
      provide: ProductCategoryPolicy,
      useFactory: (catRepo: CategoryReadOnlyPort) => new ProductCategoryPolicy(catRepo),
      inject: ['CategoryReadOnlyPort'],
    },
    // Usecases (con inyección del port)
    {
      provide: SaveProductUsecase,
      useFactory: (readRepo: IProductReadRepository, writeRepo: IProductWriteRepository, categoryService: ProductCategoryPolicy) =>
        new SaveProductUsecase(readRepo, writeRepo, categoryService),
      inject: [PRODUCT_READONLY, PRODUCT_WRITE, ProductCategoryPolicy],
    },
    {
      provide: DeleteProductUsecase,
      useFactory: (repo: IProductWriteRepository) => new DeleteProductUsecase(repo),
      inject: [PRODUCT_WRITE],
    },
    {
      provide: RestoreProductUsecase,
      useFactory: (readRepo: IProductReadRepository, writeRepo: IProductWriteRepository, categoryService: ProductCategoryPolicy) =>
        new RestoreProductUsecase(readRepo, writeRepo, categoryService),
      inject: [PRODUCT_READONLY, PRODUCT_WRITE, ProductCategoryPolicy],
    },
    {
      provide: UpdateStockUsecase,
      useFactory: (repo: IProductWriteRepository) => new UpdateStockUsecase(repo),
      inject: [PRODUCT_WRITE],
    },
    {
      provide: FindProductByIdUsecase,
      useFactory: (repo: IProductReadRepository) => new FindProductByIdUsecase(repo),
      inject: [PRODUCT_READONLY],
    },
    {
      provide: ListProductsUsecase,
      useFactory: (repo: IProductReadRepository) => new ListProductsUsecase(repo),
      inject: [PRODUCT_READONLY],
    },
    {
      provide: FindLowStockUsecase,
      useFactory: (repo: IProductReadRepository) => new FindLowStockUsecase(repo),
      inject: [PRODUCT_READONLY],
    },
    {
      provide: SearchProductsUsecase,
      useFactory: (repo: IProductReadRepository) => new SearchProductsUsecase(repo),
      inject: [PRODUCT_READONLY],
    },
    {
      provide: DecreaseStockUsecase,
      useFactory: (repo: IProductWriteRepository) => new DecreaseStockUsecase(repo),
      inject: [PRODUCT_WRITE],
    },
  ],
  exports: [DecreaseStockUsecase, PRODUCT_READONLY, PRODUCT_VALIDATION_PORT, SaveProductUsecase, UpdateStockUsecase, DeleteProductUsecase, RestoreProductUsecase, FindLowStockUsecase],
})
export class ProductsModule { }
