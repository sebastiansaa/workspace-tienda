export interface OrderReadOnlyPort {
    findById?(orderId: string): Promise<unknown>;
}

export default OrderReadOnlyPort;
