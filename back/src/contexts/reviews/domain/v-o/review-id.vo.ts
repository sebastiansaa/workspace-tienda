import { randomUUID } from 'crypto';

export class ReviewIdVO {
    private readonly valueInternal: string;

    constructor(value?: string | null) {
        const resolved = value ?? randomUUID();
        if (!ReviewIdVO.isValid(resolved)) throw new Error('Invalid review identifier');
        this.valueInternal = resolved;
    }

    static from(value?: string | null): ReviewIdVO {
        return new ReviewIdVO(value);
    }

    get value(): string {
        return this.valueInternal;
    }

    private static isValid(value: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }
}

export default ReviewIdVO;
