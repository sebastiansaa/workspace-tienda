export class TotalAmountVO {
    private readonly _value: number;

    constructor(value: number) {
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('TotalAmount must be non-negative');
        this._value = value;
    }

    get value(): number {
        return this._value;
    }
}

export default TotalAmountVO;
