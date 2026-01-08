export class OrderIdVO {
    private readonly _value: string;

    constructor(value: string) {
        if (!value) throw new Error('OrderId is required');
        this._value = value;
    }

    get value(): string {
        return this._value;
    }
}

export default OrderIdVO;
