export class IncreaseStockCommand {
    constructor(
        public readonly productId: number,
        public readonly quantity: number,
        public readonly reason: string,
    ) { }
}

export default IncreaseStockCommand;
