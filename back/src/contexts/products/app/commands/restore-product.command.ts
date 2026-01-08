export class RestoreProductCommand {
  constructor(public readonly id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('El id debe ser un entero positivo');
    }
  }
}
