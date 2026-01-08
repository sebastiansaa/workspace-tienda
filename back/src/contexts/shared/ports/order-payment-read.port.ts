export interface OrderPaymentSummaryDto {
    id: string;
    userId: string;
    totalAmount: number;
}

export interface OrderPaymentReadPort {
    findById(orderId: string): Promise<OrderPaymentSummaryDto | null>;
}

export default OrderPaymentReadPort;