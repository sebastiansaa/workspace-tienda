export interface CartItemSnapshotDto {
    productId: number;
    quantity: number;
    price?: number | null;
}

export interface CartSnapshotPort {
    getCartItems(userId: string): Promise<CartItemSnapshotDto[]>;
}

export default CartSnapshotPort;