export class DeleteProductCommand {
  constructor(public readonly id: number, public readonly soft: boolean = true) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('El id debe ser un entero positivo');
    }
  }
}
