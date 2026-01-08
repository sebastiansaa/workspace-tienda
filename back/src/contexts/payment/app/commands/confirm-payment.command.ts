export class ConfirmPaymentCommand {
    constructor(
        public readonly paymentId: string,
        public readonly userId: string,
        public readonly paymentMethodToken?: string,
    ) { }
}

export default ConfirmPaymentCommand;
