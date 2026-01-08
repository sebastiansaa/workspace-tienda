export interface CreateOrderItemInput {
    productId: number;
    quantity: number;
}

export class CreateOrderFromItemsCommand {
    constructor(public readonly userId: string, public readonly items: CreateOrderItemInput[]) { }
}

export default CreateOrderFromItemsCommand;
