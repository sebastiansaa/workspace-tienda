export type MovementType = 'INCREASE' | 'DECREASE' | 'RESERVATION' | 'RELEASE';

export class MovementTypeVO {
    private readonly _value: MovementType;

    constructor(value: MovementType) {
        this._value = value;
    }

    get value(): MovementType {
        return this._value;
    }
}

export default MovementTypeVO;
