export interface OrderPurchaseHistoryPort {
    hasUserPurchasedProduct(userId: string, productId: number): Promise<boolean>;
}

export default OrderPurchaseHistoryPort;