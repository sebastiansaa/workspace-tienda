import {
    NegativeStockError,
    StockInsufficientError,
    InvalidStockError,
} from "../errors";

export class StockVO {
    private quantity: number;

    constructor(stock: number) {
        if (!Number.isInteger(stock) || stock < 0) {
            throw new NegativeStockError();
        }
        this.quantity = stock;
    }

    public set(quantity: number): void {
        if (!Number.isInteger(quantity) || quantity < 0) throw new InvalidStockError();
        this.quantity = quantity;
    }

    public increment(amount: number): void {
        if (!Number.isInteger(amount) || amount <= 0) throw new InvalidStockError();
        this.quantity += amount;
    }

    public decrement(amount: number): void {
        if (!Number.isInteger(amount) || amount <= 0) throw new InvalidStockError();
        if (this.quantity - amount < 0) throw new StockInsufficientError();
        this.quantity -= amount;
    }

    public hasSufficient(amount: number): boolean {
        return this.quantity >= amount;
    }

    public isLowStock(threshold: number = 5): boolean {
        return this.quantity < threshold;
    }

    public isEmpty(): boolean {
        return this.quantity === 0;
    }

    public get value(): number {
        return this.quantity;
    }

    public static from(stock: number): StockVO {
        return new StockVO(stock);
    }
}
