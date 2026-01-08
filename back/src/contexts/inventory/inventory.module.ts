import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { InventoryController } from './api/controller/inventory.controller';
import { INVENTORY_AVAILABILITY_PORT, INVENTORY_PRODUCT_READONLY, INVENTORY_REPOSITORY, INVENTORY_READ_REPOSITORY, INVENTORY_RESERVATION_PORT, INVENTORY_WRITE_REPOSITORY } from './constants';
import { InventoryPrismaReadRepository } from './infra/persistence/inventory-prisma-read.repository';
import { InventoryPrismaWriteRepository } from './infra/persistence/inventory-prisma-write.repository';
import { ProductReadOnlyAdapter } from './infra/adapters/product-read.adapter';
import InventoryAvailabilityService from './infra/services/inventory-availability.service';
import InventoryReservationService from './infra/services/inventory-reservation.service';
import {
    IncreaseStockUsecase,
    DecreaseStockUsecase,
    ReserveStockUsecase,
    ReleaseStockUsecase,
    GetStockUsecase,
    ListMovementsUsecase,
} from './app/usecases';
import { IInventoryReadRepository } from './app/ports/inventory-read.repository';
import { IInventoryWriteRepository } from './app/ports/inventory-write.repository';
import ProductReadOnlyPort from './app/ports/product-read.port';

@Module({
    imports: [AuthModule, ProductsModule, PrismaModule],
    controllers: [InventoryController],
    providers: [
        {
            provide: INVENTORY_WRITE_REPOSITORY,
            useClass: InventoryPrismaWriteRepository,
        },
        {
            provide: INVENTORY_READ_REPOSITORY,
            useClass: InventoryPrismaReadRepository,
        },
        {
            provide: INVENTORY_REPOSITORY,
            useClass: InventoryPrismaWriteRepository,
        },
        {
            provide: INVENTORY_PRODUCT_READONLY,
            useClass: ProductReadOnlyAdapter,
        },
        {
            provide: INVENTORY_AVAILABILITY_PORT,
            useClass: InventoryAvailabilityService,
        },
        {
            provide: INVENTORY_RESERVATION_PORT,
            useClass: InventoryReservationService,
        },
        {
            provide: IncreaseStockUsecase,
            useFactory: (readRepo: IInventoryReadRepository, writeRepo: IInventoryWriteRepository, productRead: ProductReadOnlyPort) => new IncreaseStockUsecase(readRepo, writeRepo, productRead),
            inject: [INVENTORY_READ_REPOSITORY, INVENTORY_WRITE_REPOSITORY, INVENTORY_PRODUCT_READONLY],
        },
        {
            provide: DecreaseStockUsecase,
            useFactory: (readRepo: IInventoryReadRepository, writeRepo: IInventoryWriteRepository, productRead: ProductReadOnlyPort) => new DecreaseStockUsecase(readRepo, writeRepo, productRead),
            inject: [INVENTORY_READ_REPOSITORY, INVENTORY_WRITE_REPOSITORY, INVENTORY_PRODUCT_READONLY],
        },
        {
            provide: ReserveStockUsecase,
            useFactory: (readRepo: IInventoryReadRepository, writeRepo: IInventoryWriteRepository, productRead: ProductReadOnlyPort) => new ReserveStockUsecase(readRepo, writeRepo, productRead),
            inject: [INVENTORY_READ_REPOSITORY, INVENTORY_WRITE_REPOSITORY, INVENTORY_PRODUCT_READONLY],
        },
        {
            provide: ReleaseStockUsecase,
            useFactory: (readRepo: IInventoryReadRepository, writeRepo: IInventoryWriteRepository, productRead: ProductReadOnlyPort) => new ReleaseStockUsecase(readRepo, writeRepo, productRead),
            inject: [INVENTORY_READ_REPOSITORY, INVENTORY_WRITE_REPOSITORY, INVENTORY_PRODUCT_READONLY],
        },
        {
            provide: GetStockUsecase,
            useFactory: (readRepo: IInventoryReadRepository) => new GetStockUsecase(readRepo),
            inject: [INVENTORY_READ_REPOSITORY],
        },
        {
            provide: ListMovementsUsecase,
            useFactory: (readRepo: IInventoryReadRepository) => new ListMovementsUsecase(readRepo),
            inject: [INVENTORY_READ_REPOSITORY],
        },
    ],
    exports: [
        INVENTORY_READ_REPOSITORY,
        INVENTORY_AVAILABILITY_PORT,
        INVENTORY_RESERVATION_PORT,
        IncreaseStockUsecase,
        DecreaseStockUsecase,
        ReserveStockUsecase,
        ReleaseStockUsecase,
    ],
})
export class InventoryModule { }
