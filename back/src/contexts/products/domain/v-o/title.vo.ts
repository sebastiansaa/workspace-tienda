import { EmptyTitleError, InvalidProductTitleError } from '../errors/product.errors';

export class Title {
    private readonly _value: string;

    constructor(value: unknown) {
        if (value === undefined || value === null) {
            throw new EmptyTitleError();
        }
        if (typeof value !== 'string') {
            throw new InvalidProductTitleError();
        }
        const trimmed = value.trim();
        if (trimmed.length === 0) throw new EmptyTitleError();
        if (trimmed.length > 255) throw new InvalidProductTitleError();
        this._value = trimmed;
    }

    get value(): string {
        return this._value;
    }

    equals(other: Title): boolean {
        return this._value === other._value;
    }
}
