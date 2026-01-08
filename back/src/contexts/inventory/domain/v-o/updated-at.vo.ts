export class UpdatedAtVO {
    private readonly _value: Date;

    constructor(value?: Date) {
        const date = value ?? new Date();
        if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new Error('Invalid updatedAt');
        this._value = date;
    }

    static now(): UpdatedAtVO {
        return new UpdatedAtVO(new Date());
    }

    get value(): Date {
        return this._value;
    }
}

export default UpdatedAtVO;
