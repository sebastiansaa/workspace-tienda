export class ProductIdVO {
    private readonly _value: number;

    constructor(value: unknown) {
        if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) throw new Error('ProductId must be positive');
        this._value = value;
    }

    get value(): number {
        return this._value;
    }
}

export default ProductIdVO;
