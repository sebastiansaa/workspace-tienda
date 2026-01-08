export interface OrderWriteItem {
    productId: number;
    quantity: number;
    price: number;
}

export interface OrderWritePort {
    createCheckoutOrder(input: {
        userId: string;
        totalAmount: number;
        items?: OrderWriteItem[];
    }): Promise<{ id: string; userId: string; totalAmount: number }>;
}

export default OrderWritePort;
