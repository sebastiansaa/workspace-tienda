import { randomUUID } from 'crypto';

export class OrderIdVO {
    private readonly _value: string;

    constructor(value?: string) {
        const v = value ?? randomUUID();
        if (!v || typeof v !== 'string') throw new Error('OrderId is required');
        this._value = v;
    }

    get value(): string {
        return this._value;
    }
}

export default OrderIdVO;
