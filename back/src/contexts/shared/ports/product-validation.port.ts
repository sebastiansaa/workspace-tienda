export interface ProductValidationPort {
    ensureProductIsReviewable(productId: number): Promise<void>;
}

export default ProductValidationPort;