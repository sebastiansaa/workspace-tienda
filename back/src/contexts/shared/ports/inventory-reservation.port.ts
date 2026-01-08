export interface InventoryReservationPort {
    reserve(productId: number, quantity: number, reason: string): Promise<void>;
}

export default InventoryReservationPort;