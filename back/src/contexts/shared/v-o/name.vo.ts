import { InvalidTitleError } from "../errors/shared.errors";

export class NameVO {
    private readonly _value: string;

    constructor(value: unknown) {
        if (!value || typeof value !== 'string') {
            throw new InvalidTitleError("Name is required and must be a string");
        }

        const val = value.trim();

        if (val.length < 2) {
            throw new InvalidTitleError("Name must be at least 2 characters long");
        }

        if (val.length > 100) {
            throw new InvalidTitleError("Name cannot exceed 100 characters");
        }

        this._value = val;
    }

    get value(): string {
        return this._value;
    }

    equals(other: NameVO): boolean {
        return this._value === other.value;
    }
}
