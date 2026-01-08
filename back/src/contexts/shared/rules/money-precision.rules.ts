export class MoneyPrecision {
    static validate(amount: number, decimals: number = 2): boolean {
        if (typeof amount !== 'number' || Number.isNaN(amount)) return false;
        const factor = Math.pow(10, decimals);
        return Math.round(amount * factor) === amount * factor;
    }
}
