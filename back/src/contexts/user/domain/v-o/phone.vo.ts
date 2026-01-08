export class PhoneVO {
    private readonly valueInternal: string | null;

    constructor(value?: string | null) {
        if (value === undefined || value === null || value === '') {
            this.valueInternal = null;
            return;
        }
        if (typeof value !== 'string') throw new Error('Phone must be a string');
        const sanitized = value.trim();
        if (sanitized.length === 0) {
            this.valueInternal = null;
            return;
        }
        if (sanitized.length > 32) throw new Error('Phone too long');
        this.valueInternal = sanitized;
    }

    get value(): string | null {
        return this.valueInternal;
    }
}

export default PhoneVO;
