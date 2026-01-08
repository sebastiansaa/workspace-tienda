export class UpdatedAtVO {
    private readonly _value: Date;

    private constructor(value: Date) {
        this._value = value;
    }

    static now(): UpdatedAtVO {
        return new UpdatedAtVO(new Date());
    }

    static from(value?: Date): UpdatedAtVO {
        return new UpdatedAtVO(value ?? new Date());
    }

    get value(): Date {
        return this._value;
    }
}

export default UpdatedAtVO;
