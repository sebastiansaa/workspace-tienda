import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminController } from './api/controller/admin.controller';
import { GetDashboardStatsUsecase } from './app/usecases/get-dashboard-stats.usecase';

// Import solo para estadísticas del dashboard
import { OrderStatsAdapter } from '../orders/infra/adapters/order-stats.adapter';
import { ProductsModule } from '../products/products.module';
import { ProductAdminAdapter } from '../products/infra/adapters/product-admin.adapter';
import { UserModule } from '../user/user.module';
import { UserAdminAdapter } from '../user/infra/adapters/user-admin.adapter';

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        ProductsModule,
        UserModule,
    ],
    controllers: [AdminController],
    providers: [
        GetDashboardStatsUsecase,
        {
            provide: 'OrderStatsPort',
            useClass: OrderStatsAdapter,
        },
        ProductAdminAdapter,
        {
            provide: 'ProductAdminPort',
            useExisting: ProductAdminAdapter,
        },
        UserAdminAdapter,
        {
            provide: 'UserAdminPort',
            useExisting: UserAdminAdapter,
        },
    ],
})
export class AdminModule { }
