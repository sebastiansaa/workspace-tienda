export class DecreaseStockCommand {
    constructor(
        public readonly productId: number,
        public readonly quantity: number,
        public readonly reason: string,
    ) { }
}

export default DecreaseStockCommand;
