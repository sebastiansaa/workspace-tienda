import { InvalidEmailError } from "../errors/shared.errors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Value Object para la validación y normalización de correos electrónicos.
 * Garantiza que cualquier email en el sistema tenga el formato correcto y esté en minúsculas.
 */
export class EmailVO {
    private readonly _value: string;

    constructor(value: unknown) {
        if (!value || typeof value !== 'string') throw new InvalidEmailError('Email is required and must be a string');
        const normalized = value.trim().toLowerCase();
        if (!EMAIL_REGEX.test(normalized)) throw new InvalidEmailError('Invalid email format');
        this._value = normalized;
    }

    get value(): string {
        return this._value;
    }

    equals(other: EmailVO): boolean {
        return this._value === other.value;
    }
}
