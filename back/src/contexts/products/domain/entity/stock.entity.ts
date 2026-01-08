// ...existing code...
import { StockVO } from "../v-o";

export class StockEntity {
    private stock: StockVO;

    constructor(stock: number | StockVO) {
        this.stock = stock instanceof StockVO ? stock : new StockVO(stock);
    }

    public set(quantity: number): void {
        this.stock.set(quantity);
    }

    public increment(amount: number): void {
        this.stock.increment(amount);
    }

    public decrement(amount: number): void {
        this.stock.decrement(amount);
    }

    public hasSufficient(amount: number): boolean {
        return this.stock.hasSufficient(amount);
    }

    public isLowStock(threshold: number = 5): boolean {
        return this.stock.isLowStock(threshold);
    }

    public isEmpty(): boolean {
        return this.stock.isEmpty();
    }

    public get value(): number {
        return this.stock.value;
    }
}
