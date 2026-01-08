export class UpdateStockCommand {
  constructor(public readonly id: number, public readonly quantity: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('El id debe ser un entero positivo');
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error('La cantidad debe ser un entero mayor o igual a cero');
    }
  }
}
