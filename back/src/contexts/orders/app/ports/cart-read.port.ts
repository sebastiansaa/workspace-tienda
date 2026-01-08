export interface CartItemSnapshot {
    productId: number;
    quantity: number;
    price?: number;
}

export interface CartReadOnlyPort {
    getCartItems(userId: string): Promise<CartItemSnapshot[]>;
}

export default CartReadOnlyPort;
