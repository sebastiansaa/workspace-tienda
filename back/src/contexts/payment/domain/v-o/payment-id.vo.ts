import { randomUUID } from 'crypto';

export class PaymentIdVO {
    private readonly _value: string;

    constructor(value?: string) {
        const v = value ?? randomUUID();
        if (!v) throw new Error('PaymentId is required');
        this._value = v;
    }

    get value(): string {
        return this._value;
    }
}

export default PaymentIdVO;
