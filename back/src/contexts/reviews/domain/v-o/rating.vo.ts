export class RatingVO {
    private readonly valueInternal: number;

    constructor(value: number) {
        if (!Number.isFinite(value)) throw new Error('Rating must be a number');
        const rounded = Math.round(value);
        if (rounded < 1 || rounded > 5) throw new Error('Rating must be between 1 and 5');
        this.valueInternal = rounded;
    }

    get value(): number {
        return this.valueInternal;
    }
}

export default RatingVO;
