export class CreatedAtVO {
    private readonly _value: Date;

    constructor(value?: Date) {
        this._value = value ?? new Date();
    }

    get value(): Date {
        return this._value;
    }
}

export default CreatedAtVO;
