import { randomUUID } from 'crypto';

export class InventoryItemIdVO {
    private readonly _value: string;

    constructor(value?: string) {
        const v = value ?? randomUUID();
        if (!v || typeof v !== 'string') throw new Error('InventoryItemId is required');
        this._value = v;
    }

    get value(): string {
        return this._value;
    }
}

export default InventoryItemIdVO;
