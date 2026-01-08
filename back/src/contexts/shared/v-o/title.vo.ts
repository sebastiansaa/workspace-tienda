import { InvalidTitleError } from "../errors/shared.errors";

export class TitleVO {
    private readonly _value: string;

    constructor(value: unknown) {
        if (value === undefined || value === null) {
            throw new InvalidTitleError("Invariant: title es obligatorio");
        }

        const val = String(value).trim();

        if (val.length < 3) {
            throw new InvalidTitleError("Invariant: title debe tener al menos 3 caracteres");
        }

        if (val.length > 100) {
            throw new InvalidTitleError("Invariant: title no puede superar los 100 caracteres");
        }

        this._value = val;
    }

    get value(): string {
        return this._value;
    }

    equals(other: TitleVO): boolean {
        return this._value === other.value;
    }
}