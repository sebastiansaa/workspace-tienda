import { InvalidQuantityError } from '../errors/cart.errors';

export class QuantityVO {
    private readonly _value: number;

    constructor(value: unknown) {
        if (typeof value !== 'number' || !Number.isFinite(value)) throw new InvalidQuantityError('Quantity must be a number');
        if (value <= 0) throw new InvalidQuantityError();
        this._value = Math.floor(value);
    }

    get value(): number {
        return this._value;
    }
}

export default QuantityVO;
