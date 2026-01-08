export interface ReserveStockPort {
    reserve(productId: number, quantity: number, reason: string): Promise<void>;
}

export default ReserveStockPort;
