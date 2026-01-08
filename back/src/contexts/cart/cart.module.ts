import { Module } from '@nestjs/common';
import { CartController } from './api/controller/cart.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CART_PRICING_SERVICE, CART_READ_REPOSITORY, CART_SNAPSHOT_PORT, CART_WRITE_REPOSITORY, CART_STOCK_SERVICE } from './constants';
import { CartPrismaReadRepository } from './infra/persistence/cart-prisma-read.repository';
import { CartPrismaWriteRepository } from './infra/persistence/cart-prisma-write.repository';
import CartPricingService from './infra/services/cart-pricing.service';
import CartStockService from './infra/services/cart-stock.service';
import CartSnapshotService from './infra/services/cart-snapshot.service';
import { ICartReadRepository } from './app/ports/cart-read.repository';
import { ICartWriteRepository } from './app/ports/cart-write.repository';
import PricingServicePort from './app/ports/pricing-service.port';
import StockAvailabilityPort from './app/ports/stock-availability.port';
import {
    AddItemToCartUseCase,
    UpdateItemQuantityUseCase,
    RemoveItemUseCase,
    GetCartUseCase,
    ClearCartUseCase,
} from './app/usecases';

@Module({
    imports: [AuthModule, ProductsModule, InventoryModule],
    controllers: [CartController],
    providers: [
        PrismaService,
        {
            provide: CART_READ_REPOSITORY,
            useClass: CartPrismaReadRepository,
        },
        {
            provide: CART_WRITE_REPOSITORY,
            useClass: CartPrismaWriteRepository,
        },
        {
            provide: CART_PRICING_SERVICE,
            useClass: CartPricingService,
        },
        {
            provide: CART_STOCK_SERVICE,
            useClass: CartStockService,
        },
        {
            provide: CART_SNAPSHOT_PORT,
            useClass: CartSnapshotService,
        },
        {
            provide: AddItemToCartUseCase,
            useFactory: (
                readRepo: ICartReadRepository,
                writeRepo: ICartWriteRepository,
                pricing: PricingServicePort,
                stock: StockAvailabilityPort,
            ) => new AddItemToCartUseCase(readRepo, writeRepo, pricing, stock),
            inject: [CART_READ_REPOSITORY, CART_WRITE_REPOSITORY, CART_PRICING_SERVICE, CART_STOCK_SERVICE],
        },
        {
            provide: UpdateItemQuantityUseCase,
            useFactory: (readRepo: ICartReadRepository, writeRepo: ICartWriteRepository, pricing: PricingServicePort) =>
                new UpdateItemQuantityUseCase(readRepo, writeRepo, pricing),
            inject: [CART_READ_REPOSITORY, CART_WRITE_REPOSITORY, CART_PRICING_SERVICE],
        },
        {
            provide: RemoveItemUseCase,
            useFactory: (readRepo: ICartReadRepository, writeRepo: ICartWriteRepository) =>
                new RemoveItemUseCase(readRepo, writeRepo),
            inject: [CART_READ_REPOSITORY, CART_WRITE_REPOSITORY],
        },
        {
            provide: GetCartUseCase,
            useFactory: (readRepo: ICartReadRepository) => new GetCartUseCase(readRepo),
            inject: [CART_READ_REPOSITORY],
        },
        {
            provide: ClearCartUseCase,
            useFactory: (writeRepo: ICartWriteRepository) => new ClearCartUseCase(writeRepo),
            inject: [CART_WRITE_REPOSITORY],
        },
    ],
    exports: [CART_SNAPSHOT_PORT, CART_PRICING_SERVICE, CART_STOCK_SERVICE],
})
export class CartModule { }
