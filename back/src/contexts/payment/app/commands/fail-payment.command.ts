export class FailPaymentCommand {
    constructor(
        public readonly paymentId: string,
        public readonly userId: string,
    ) { }
}

export default FailPaymentCommand;
