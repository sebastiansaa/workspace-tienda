export interface StockServicePort {
    isAvailable(productId: number, quantity: number): Promise<boolean>;
}

export default StockServicePort;
