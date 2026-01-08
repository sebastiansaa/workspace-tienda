import { randomUUID } from 'crypto';

export class ExternalPaymentIdVO {
    private readonly _value: string;

    constructor(value?: string) {
        const v = value ?? `pi_fake_${randomUUID().replace(/-/g, '').slice(0, 24)}`;
        this._value = v;
    }

    get value(): string {
        return this._value;
    }
}

export default ExternalPaymentIdVO;
