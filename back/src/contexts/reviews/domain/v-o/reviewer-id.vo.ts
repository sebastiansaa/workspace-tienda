import { randomUUID } from 'crypto';

export class ReviewerIdVO {
    private readonly valueInternal: string;

    constructor(value: string) {
        if (!ReviewerIdVO.isValid(value)) throw new Error('Invalid reviewer identifier');
        this.valueInternal = value;
    }

    static generate(): ReviewerIdVO {
        return new ReviewerIdVO(randomUUID());
    }

    get value(): string {
        return this.valueInternal;
    }

    private static isValid(value: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }
}

export default ReviewerIdVO;
