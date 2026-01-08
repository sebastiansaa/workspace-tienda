import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { PaymentController } from './api/controller/payment.controller';
import { PAYMENT_ORDER_READONLY, PAYMENT_ORDER_WRITE, PAYMENT_PROVIDER, PAYMENT_READ_REPOSITORY, PAYMENT_WRITE_REPOSITORY } from './constants';
import { PaymentPrismaReadRepository } from './infra/persistence/payment-prisma-read.repository';
import { PaymentPrismaWriteRepository } from './infra/persistence/payment-prisma-write.repository';
import { PaymentProviderFakeAdapter } from './infra/adapters/payment-provider-fake.adapter';
import { OrdersModule } from '../orders/order.module';
import { ORDER_PAYMENT_READ_PORT, ORDER_PAYMENT_WRITE_PORT } from '../orders/constants';
import {
    InitiatePaymentUsecase,
    ConfirmPaymentUsecase,
    FailPaymentUsecase,
    GetPaymentByIdUsecase,
    ListPaymentsForUserUsecase,
    ListAllPaymentsUsecase,
    AdminGetPaymentByIdUsecase,
} from './app/usecases';
import { IPaymentReadRepository } from './app/ports/payment-read.repository';
import { IPaymentWriteRepository } from './app/ports/payment-write.repository';
import PaymentProviderPort from './app/ports/payment-provider.port';
import OrderReadOnlyPort from './app/ports/order-read.port';
import OrderWritePort from './app/ports/order-write.port';

@Module({
    imports: [AuthModule, PrismaModule, OrdersModule],
    controllers: [PaymentController],
    providers: [
        {
            provide: PAYMENT_WRITE_REPOSITORY,
            useClass: PaymentPrismaWriteRepository,
        },
        {
            provide: PAYMENT_READ_REPOSITORY,
            useClass: PaymentPrismaReadRepository,
        },
        {
            provide: PAYMENT_PROVIDER,
            useClass: PaymentProviderFakeAdapter,
        },
        {
            provide: PAYMENT_ORDER_READONLY,
            useExisting: ORDER_PAYMENT_READ_PORT,
        },
        {
            provide: PAYMENT_ORDER_WRITE,
            useExisting: ORDER_PAYMENT_WRITE_PORT,
        },
        {
            provide: InitiatePaymentUsecase,
            useFactory: (writeRepo: IPaymentWriteRepository, provider: PaymentProviderPort, orderRead: OrderReadOnlyPort, orderWrite: OrderWritePort) =>
                new InitiatePaymentUsecase(writeRepo, provider, orderRead, orderWrite),
            inject: [PAYMENT_WRITE_REPOSITORY, PAYMENT_PROVIDER, PAYMENT_ORDER_READONLY, PAYMENT_ORDER_WRITE],
        },
        {
            provide: ConfirmPaymentUsecase,
            useFactory: (readRepo: IPaymentReadRepository, writeRepo: IPaymentWriteRepository, provider: PaymentProviderPort) =>
                new ConfirmPaymentUsecase(readRepo, writeRepo, provider),
            inject: [PAYMENT_READ_REPOSITORY, PAYMENT_WRITE_REPOSITORY, PAYMENT_PROVIDER],
        },
        {
            provide: FailPaymentUsecase,
            useFactory: (readRepo: IPaymentReadRepository, writeRepo: IPaymentWriteRepository, provider: PaymentProviderPort) =>
                new FailPaymentUsecase(readRepo, writeRepo, provider),
            inject: [PAYMENT_READ_REPOSITORY, PAYMENT_WRITE_REPOSITORY, PAYMENT_PROVIDER],
        },
        {
            provide: GetPaymentByIdUsecase,
            useFactory: (readRepo: IPaymentReadRepository) => new GetPaymentByIdUsecase(readRepo),
            inject: [PAYMENT_READ_REPOSITORY],
        },
        {
            provide: ListPaymentsForUserUsecase,
            useFactory: (readRepo: IPaymentReadRepository) => new ListPaymentsForUserUsecase(readRepo),
            inject: [PAYMENT_READ_REPOSITORY],
        },
        {
            provide: ListAllPaymentsUsecase,
            useFactory: (readRepo: IPaymentReadRepository) => new ListAllPaymentsUsecase(readRepo),
            inject: [PAYMENT_READ_REPOSITORY],
        },
        {
            provide: AdminGetPaymentByIdUsecase,
            useFactory: (readRepo: IPaymentReadRepository) => new AdminGetPaymentByIdUsecase(readRepo),
            inject: [PAYMENT_READ_REPOSITORY],
        },
    ],
    exports: [
        PAYMENT_READ_REPOSITORY,
        PAYMENT_WRITE_REPOSITORY,
        ListAllPaymentsUsecase,
        AdminGetPaymentByIdUsecase,
    ],
})
export class PaymentModule { }
