export class AmountVO {
    private readonly _value: number;

    constructor(value: number) {
        if (value === undefined || value === null || Number.isNaN(value)) {
            throw new Error('Amount is required');
        }
        if (value <= 0) throw new Error('Amount must be greater than zero');
        this._value = value;
    }

    get value(): number {
        return this._value;
    }
}

export default AmountVO;
