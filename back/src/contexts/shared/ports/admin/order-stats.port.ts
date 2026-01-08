export interface OrderStatsPort {
    countTotal(): Promise<number>;
    sumRevenue(status: string): Promise<number>;
    countByStatus(status: string): Promise<number>;
}
