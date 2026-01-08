import { Inject, Injectable } from '@nestjs/common';
import type { OrderStatsPort, ProductAdminPort, UserAdminPort } from '../../../shared/ports/admin';

export interface DashboardStatsResult {
    totalUsers: number;
    totalRevenue: number;
    totalOrders: number;
    pendingOrdersCount: number;
    lowStockProductsCount: number;
}

@Injectable()
export class GetDashboardStatsUsecase {
    constructor(
        @Inject('OrderStatsPort') private readonly orderStats: OrderStatsPort,
        @Inject('ProductAdminPort') private readonly productAdmin: ProductAdminPort,
        @Inject('UserAdminPort') private readonly userAdmin: UserAdminPort,
    ) { }

    async execute(): Promise<DashboardStatsResult> {
        const users = await this.userAdmin.listUsers();
        const totalUsers = users.length;

        const totalOrders = await this.orderStats.countTotal();
        const totalRevenue = await this.orderStats.sumRevenue('PAID');
        const pendingOrdersCount = await this.orderStats.countByStatus('PENDING');

        const lowStockProducts = await this.productAdmin.findLowStock(10);
        const lowStockProductsCount = lowStockProducts.length;

        return {
            totalUsers,
            totalRevenue,
            totalOrders,
            pendingOrdersCount,
            lowStockProductsCount,
        };
    }
}
