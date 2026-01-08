export class SoftDeleteVO {
    private readonly _value?: Date;

    constructor(value?: Date) {
        if (value && !(value instanceof Date)) {
            throw new Error("Invariant: SoftDelete debe ser una fecha válida o undefined");
        }
        this._value = value;
    }

    get value(): Date | undefined {
        return this._value;
    }

    isDeleted(): boolean {
        return this._value !== undefined;
    }

    restore(): SoftDeleteVO {
        return new SoftDeleteVO(undefined);
    }

    delete(now: Date = new Date()): SoftDeleteVO {
        return new SoftDeleteVO(now);
    }
}