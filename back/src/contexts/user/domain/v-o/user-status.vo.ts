import { InvalidUserStatusError } from '../errors/user.errors';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
const allowed: UserStatus[] = ['ACTIVE', 'SUSPENDED', 'DELETED'];

export class UserStatusVO {
    private readonly _value: UserStatus;

    constructor(value: UserStatus) {
        if (!allowed.includes(value)) throw new InvalidUserStatusError();
        this._value = value;
    }

    get value(): UserStatus {
        return this._value;
    }
}

export default UserStatusVO;
