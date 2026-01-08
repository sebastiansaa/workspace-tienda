export class UserIdVO {
    private readonly _value: string;

    constructor(value: string) {
        if (!value) throw new Error('UserId is required');
        this._value = value;
    }

    get value(): string {
        return this._value;
    }
}

export default UserIdVO;
