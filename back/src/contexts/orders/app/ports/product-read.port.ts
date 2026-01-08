export interface ProductSnapshot {
    id: number;
    price: number;
    stock: number;
}

export interface ProductReadOnlyPort {
    findById(productId: number): Promise<ProductSnapshot | null>;
}

export default ProductReadOnlyPort;
