import { InvalidRoleError } from '../errors/auth.errors';

export class RoleVO {
    private readonly _value: string;
    static readonly ALLOWED = ['user', 'admin'];
    constructor(value: unknown) {
        if (value === undefined || value === null) throw new InvalidRoleError('Role is required');
        if (typeof value !== 'string') throw new InvalidRoleError('Role must be string');
        const v = value.trim().toLowerCase();
        if (!RoleVO.ALLOWED.includes(v)) throw new InvalidRoleError('Invalid role');
        this._value = v;
    }
    get value(): string {
        return this._value;
    }
}
