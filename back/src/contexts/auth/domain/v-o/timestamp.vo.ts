export class TimestampVO {
    private readonly valueInternal: Date;

    private constructor(value: Date) {
        this.valueInternal = value;
    }

    static from(value?: Date): TimestampVO {
        const resolved = value instanceof Date ? new Date(value.getTime()) : new Date();
        if (Number.isNaN(resolved.getTime())) throw new Error('Invalid timestamp');
        return new TimestampVO(resolved);
    }

    static now(): TimestampVO {
        return new TimestampVO(new Date());
    }

    get value(): Date {
        return new Date(this.valueInternal.getTime());
    }
}

export default TimestampVO;
