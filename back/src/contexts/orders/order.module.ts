import { Module } from '@nestjs/common';
import { OrdersController } from './api/controller/orders.controller';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CartModule } from '../cart/cart.module';
import { PrismaService } from '../../prisma/prisma.service';
import {
    CreateOrderFromCartUsecase,
    CreateOrderFromItemsUsecase,
    GetOrderByIdUsecase,
    ListOrdersForUserUsecase,
    CancelOrderUsecase,
    MarkOrderAsPaidUsecase,
    MarkOrderAsCompletedUsecase,
    ListAllOrdersUsecase,
    AdminGetOrderByIdUsecase,
    AdminMarkOrderAsCompletedUsecase,
} from './app/usecases';
import { ORDER_CART_READONLY, ORDER_PAYMENT_READ_PORT, ORDER_PAYMENT_WRITE_PORT, ORDER_PRODUCT_READONLY, ORDER_PRICING_SERVICE, ORDER_PURCHASE_HISTORY_PORT, ORDER_STOCK_SERVICE, ORDER_READ_REPOSITORY, ORDER_WRITE_REPOSITORY, ORDER_RESERVE_STOCK } from './constants';
import { OrderPrismaReadRepository } from './infra/persistence/order-prisma-read.repository';
import { OrderPrismaWriteRepository } from './infra/persistence/order-prisma-write.repository';
import CartReadOnlyAdapter from './infra/adapters/cart-read.adapter';
import ProductReadOnlyAdapter from './infra/adapters/product-read.adapter';
import PricingServiceAdapter from './infra/adapters/pricing-service.adapter';
import InventoryStockAdapter from './infra/adapters/inventory-stock.adapter';
import ReserveStockAdapter from './infra/adapters/reserve-stock.adapter';
import OrderPaymentReadAdapter from './infra/adapters/order-payment-read.adapter';
import OrderPaymentWriteAdapter from './infra/adapters/order-payment-write.adapter';
import OrderPurchaseHistoryAdapter from './infra/adapters/order-purchase-history.adapter';
import { IOrderReadRepository } from './app/ports/order-read.repository';
import { IOrderWriteRepository } from './app/ports/order-write.repository';
import CartReadOnlyPort from './app/ports/cart-read.port';
import ProductReadOnlyPort from './app/ports/product-read.port';
import PricingServicePort from './app/ports/pricing.service.port';
import StockServicePort from './app/ports/stock.service.port';
import ReserveStockPort from './app/ports/reserve-stock.port';

@Module({
    imports: [AuthModule, ProductsModule, InventoryModule, CartModule],
    controllers: [OrdersController],
    providers: [
        PrismaService,
        {
            provide: ORDER_WRITE_REPOSITORY,
            useClass: OrderPrismaWriteRepository,
        },
        {
            provide: ORDER_READ_REPOSITORY,
            useClass: OrderPrismaReadRepository,
        },
        {
            provide: ORDER_CART_READONLY,
            useClass: CartReadOnlyAdapter,
        },
        {
            provide: ORDER_PRODUCT_READONLY,
            useClass: ProductReadOnlyAdapter,
        },
        {
            provide: ORDER_PRICING_SERVICE,
            useClass: PricingServiceAdapter,
        },
        {
            provide: ORDER_STOCK_SERVICE,
            useClass: InventoryStockAdapter,
        },
        {
            provide: ORDER_RESERVE_STOCK,
            useClass: ReserveStockAdapter,
        },
        {
            provide: ORDER_PAYMENT_READ_PORT,
            useClass: OrderPaymentReadAdapter,
        },
        {
            provide: ORDER_PAYMENT_WRITE_PORT,
            useClass: OrderPaymentWriteAdapter,
        },
        {
            provide: ORDER_PURCHASE_HISTORY_PORT,
            useClass: OrderPurchaseHistoryAdapter,
        },
        {
            provide: CreateOrderFromCartUsecase,
            useFactory: (
                writeRepo: IOrderWriteRepository,
                cart: CartReadOnlyPort,
                product: ProductReadOnlyPort,
                pricing: PricingServicePort,
                stock: StockServicePort,
                reserve: ReserveStockPort,
            ) => new CreateOrderFromCartUsecase(writeRepo, cart, product, pricing, stock, reserve),
            inject: [ORDER_WRITE_REPOSITORY, ORDER_CART_READONLY, ORDER_PRODUCT_READONLY, ORDER_PRICING_SERVICE, ORDER_STOCK_SERVICE, ORDER_RESERVE_STOCK],
        },
        {
            provide: CreateOrderFromItemsUsecase,
            useFactory: (
                writeRepo: IOrderWriteRepository,
                product: ProductReadOnlyPort,
                pricing: PricingServicePort,
                stock: StockServicePort,
                reserve: ReserveStockPort,
            ) => new CreateOrderFromItemsUsecase(writeRepo, product, pricing, stock, reserve),
            inject: [ORDER_WRITE_REPOSITORY, ORDER_PRODUCT_READONLY, ORDER_PRICING_SERVICE, ORDER_STOCK_SERVICE, ORDER_RESERVE_STOCK],
        },
        {
            provide: GetOrderByIdUsecase,
            useFactory: (readRepo: IOrderReadRepository) => new GetOrderByIdUsecase(readRepo),
            inject: [ORDER_READ_REPOSITORY],
        },
        {
            provide: ListOrdersForUserUsecase,
            useFactory: (readRepo: IOrderReadRepository) => new ListOrdersForUserUsecase(readRepo),
            inject: [ORDER_READ_REPOSITORY],
        },
        {
            provide: CancelOrderUsecase,
            useFactory: (readRepo: IOrderReadRepository, writeRepo: IOrderWriteRepository) => new CancelOrderUsecase(readRepo, writeRepo),
            inject: [ORDER_READ_REPOSITORY, ORDER_WRITE_REPOSITORY],
        },
        {
            provide: MarkOrderAsPaidUsecase,
            useFactory: (readRepo: IOrderReadRepository, writeRepo: IOrderWriteRepository) => new MarkOrderAsPaidUsecase(readRepo, writeRepo),
            inject: [ORDER_READ_REPOSITORY, ORDER_WRITE_REPOSITORY],
        },
        {
            provide: MarkOrderAsCompletedUsecase,
            useFactory: (readRepo: IOrderReadRepository, writeRepo: IOrderWriteRepository) => new MarkOrderAsCompletedUsecase(readRepo, writeRepo),
            inject: [ORDER_READ_REPOSITORY, ORDER_WRITE_REPOSITORY],
        },
        {
            provide: ListAllOrdersUsecase,
            useFactory: (readRepo: IOrderReadRepository) => new ListAllOrdersUsecase(readRepo),
            inject: [ORDER_READ_REPOSITORY],
        },
        {
            provide: AdminGetOrderByIdUsecase,
            useFactory: (readRepo: IOrderReadRepository) => new AdminGetOrderByIdUsecase(readRepo),
            inject: [ORDER_READ_REPOSITORY],
        },
        {
            provide: AdminMarkOrderAsCompletedUsecase,
            useFactory: (readRepo: IOrderReadRepository, writeRepo: IOrderWriteRepository) => new AdminMarkOrderAsCompletedUsecase(readRepo, writeRepo),
            inject: [ORDER_READ_REPOSITORY, ORDER_WRITE_REPOSITORY],
        },
    ],
    exports: [
        ORDER_READ_REPOSITORY,
        ORDER_WRITE_REPOSITORY,
        ORDER_PAYMENT_READ_PORT,
        ORDER_PAYMENT_WRITE_PORT,
        ORDER_PURCHASE_HISTORY_PORT,
        ListAllOrdersUsecase,
        AdminGetOrderByIdUsecase,
        AdminMarkOrderAsCompletedUsecase,
        MarkOrderAsCompletedUsecase,
    ],
})
export class OrdersModule { }
