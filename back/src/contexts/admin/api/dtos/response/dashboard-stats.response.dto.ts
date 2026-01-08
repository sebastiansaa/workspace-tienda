import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsResponseDto {
    @ApiProperty({ example: 150, description: 'Total registerd users' })
    totalUsers: number;

    @ApiProperty({ example: 12500.50, description: 'Total revenue from paid orders' })
    totalRevenue: number;

    @ApiProperty({ example: 45, description: 'Total orders placed' })
    totalOrders: number;

    @ApiProperty({ example: 12, description: 'Number of orders pending or processing today' })
    pendingOrdersCount: number;

    @ApiProperty({ example: 5, description: 'Products with stock below threshold' })
    lowStockProductsCount: number;
}
