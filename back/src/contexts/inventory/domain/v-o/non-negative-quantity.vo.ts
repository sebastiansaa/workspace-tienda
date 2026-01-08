export class NonNegativeQuantityVO {
    private readonly _value: number;

    constructor(value: unknown) {
        if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('Quantity must be a number');
        if (value < 0) throw new Error('Quantity cannot be negative');
        this._value = Math.floor(value);
    }

    get value(): number {
        return this._value;
    }
}

export default NonNegativeQuantityVO;
