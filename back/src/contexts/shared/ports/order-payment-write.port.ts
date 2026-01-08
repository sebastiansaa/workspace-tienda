export interface OrderPaymentItemDto {
    productId: number;
    quantity: number;
    price: number;
}

export interface OrderPaymentWritePort {
    createCheckoutOrder(input: {
        userId: string;
        totalAmount: number;
        items?: OrderPaymentItemDto[];
    }): Promise<{ id: string; userId: string; totalAmount: number }>;
}

export default OrderPaymentWritePort;