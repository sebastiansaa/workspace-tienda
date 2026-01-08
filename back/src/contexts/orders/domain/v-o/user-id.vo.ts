export class UserIdVO {
    private readonly _value: string;

    constructor(value: unknown) {
        if (typeof value !== 'string' || value.trim().length === 0) throw new Error('UserId is required');
        this._value = value.trim();
    }

    get value(): string {
        return this._value;
    }
}

export default UserIdVO;
