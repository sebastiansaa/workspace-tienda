export interface OrdersPort {
    hasUserPurchasedProduct(userId: string, productId: number): Promise<boolean>;
}

export default OrdersPort;
