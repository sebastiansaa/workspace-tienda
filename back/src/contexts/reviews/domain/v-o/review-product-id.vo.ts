export class ReviewProductIdVO {
    private readonly valueInternal: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error('Product id must be a positive integer');
        }
        this.valueInternal = value;
    }

    get value(): number {
        return this.valueInternal;
    }
}

export default ReviewProductIdVO;
