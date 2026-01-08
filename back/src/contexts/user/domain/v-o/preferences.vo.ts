export class PreferencesVO {
    private readonly valueInternal: Record<string, unknown> | null;

    constructor(value?: Record<string, unknown> | null) {
        if (value === undefined || value === null) {
            this.valueInternal = null;
            return;
        }
        if (typeof value !== 'object' || Array.isArray(value)) throw new Error('Preferences must be an object');
        this.valueInternal = Object.freeze({ ...value });
    }

    get value(): Record<string, unknown> | null {
        return this.valueInternal;
    }
}

export default PreferencesVO;
