export interface InventoryAvailabilityPort {
    isAvailable(productId: number, quantity: number): Promise<boolean>;
}

export default InventoryAvailabilityPort;