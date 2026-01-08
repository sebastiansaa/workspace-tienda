export interface PricingServicePort {
    getPrice(productId: number): Promise<number | null>;
}

export default PricingServicePort;
