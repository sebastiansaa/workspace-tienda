export interface ProductsPort {
    ensureProductExists(productId: number): Promise<void>;
}

export default ProductsPort;
