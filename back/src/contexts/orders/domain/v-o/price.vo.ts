export class PriceVO {
    private readonly _value: number;

    constructor(value: unknown) {
        if (value === undefined || value === null) throw new Error('Price is required');
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('Price must be a non-negative number');
        this._value = value;
    }

    get value(): number {
        return this._value;
    }
}

export default PriceVO;
