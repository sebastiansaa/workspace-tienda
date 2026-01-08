export class RemoveItemCommand {
    constructor(
        public readonly userId: string,
        public readonly productId: number,
    ) {
        if (!userId || userId.trim().length === 0) throw new Error('El usuario es requerido');
        if (!Number.isInteger(productId) || productId <= 0) throw new Error('El producto debe ser un entero positivo');
    }
}
