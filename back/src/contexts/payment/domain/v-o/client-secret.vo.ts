import { randomUUID } from 'crypto';

export class ClientSecretVO {
    private readonly _value: string;

    constructor(value?: string) {
        this._value = value ?? `cs_test_${randomUUID().replace(/-/g, '').slice(0, 24)}`;
    }

    get value(): string {
        return this._value;
    }
}

export default ClientSecretVO;
