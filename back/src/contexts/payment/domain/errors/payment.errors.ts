export class InvalidPaymentStateError extends Error {
    constructor(message = 'Invalid payment state transition') {
        super(message);
        this.name = 'InvalidPaymentStateError';
    }
}

export class PaymentAlreadyProcessedError extends Error {
    constructor(message = 'Payment already processed') {
        super(message);
        this.name = 'PaymentAlreadyProcessedError';
    }
}
