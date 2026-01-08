export class CreatedAtVO {
    private readonly _value: Date;

    constructor(value?: Date) {
        const date = value ?? new Date();
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new Error('Invalid createdAt');
        this._value = date;
    }

    get value(): Date {
        return this._value;
    }
}

export default CreatedAtVO;
