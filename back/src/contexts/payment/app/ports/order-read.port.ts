export interface OrderReadOnlyPort {
    findById(orderId: string): Promise<{ id: string; userId: string; totalAmount: number } | null>;
}

export default OrderReadOnlyPort;
