export class DateVO {
    private readonly _value: Date;

    constructor(value?: Date | string | number) {
        if (value === undefined || value === null) {
            this._value = new Date();
        } else {
            const d = new Date(value);
            if (isNaN(d.getTime())) {
                throw new Error("Invalid date");
            }
            this._value = d;
        }
    }

    static now(): DateVO {
        return new DateVO();
    }

    static from(value?: Date | string | number): DateVO {
        return new DateVO(value);
    }

    get value(): Date {
        return this._value;
    }

    equals(other: DateVO): boolean {
        return this._value.getTime() === other.value.getTime();
    }
}
