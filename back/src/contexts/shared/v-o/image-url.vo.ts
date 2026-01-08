import { InvalidImageUrlError } from "../errors/shared.errors";

export class ImageUrlVO {
    private readonly _value: string;

    constructor(value: string) {
        if (!value || typeof value !== "string") throw new InvalidImageUrlError();

        let isValid = false;
        try {
            const parsed = new URL(value);
            isValid = /^https?:$/.test(parsed.protocol);
        } catch {
            isValid = false;
        }

        if (!isValid) throw new InvalidImageUrlError();
        this._value = value;
    }

    get value(): string {
        return this._value;
    }

    equals(other: ImageUrlVO): boolean {
        return this._value === other.value;
    }
}