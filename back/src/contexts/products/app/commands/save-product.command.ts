import { ProductProps } from '../../domain/entity/productPropInterface';

export class SaveProductCommand {
  constructor(public readonly payload: Readonly<Partial<ProductProps>>) {
    if (payload.id !== undefined && (!Number.isInteger(payload.id) || payload.id <= 0)) {
      throw new Error('El id debe ser un entero positivo');
    }
    if (payload.categoryId !== undefined && (!Number.isInteger(payload.categoryId) || payload.categoryId <= 0)) {
      throw new Error('La categoría debe ser un entero positivo');
    }
  }
}
