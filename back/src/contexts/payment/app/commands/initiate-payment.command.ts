export interface InitiatePaymentItemPayload {
    productId: number;
    quantity: number;
    price: number;
}

export class InitiatePaymentCommand {
    constructor(
        public readonly orderId: string | null,
        public readonly amount: number,
        public readonly userId: string,
        public readonly items: InitiatePaymentItemPayload[] | undefined,
        public readonly paymentMethodToken: string | undefined,
        public readonly currency: string | undefined,
    ) { }
}

export default InitiatePaymentCommand;
