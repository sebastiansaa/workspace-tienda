export interface StockAvailabilityPort {
    isAvailable(productId: number, quantity: number): Promise<boolean>;
}

export default StockAvailabilityPort;
