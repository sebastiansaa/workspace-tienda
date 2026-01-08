import { randomUUID } from 'crypto';

export class StockMovementIdVO {
    private readonly valueInternal: string;

    constructor(value?: string) {
        const resolved = value ?? randomUUID();
        if (!resolved || typeof resolved !== 'string') throw new Error('StockMovementId is required');
        this.valueInternal = resolved;
    }

    get value(): string {
        return this.valueInternal;
    }
}

export default StockMovementIdVO;
