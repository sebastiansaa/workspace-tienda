export interface ProductSnapshot {
    id: number;
}

export interface ProductReadOnlyPort {
    findById(productId: number): Promise<ProductSnapshot | null>;
}

export default ProductReadOnlyPort;
