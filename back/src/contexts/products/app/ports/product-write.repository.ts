import { ProductEntity } from "../../domain/entity/product.entity";

export interface IProductWriteRepository {
  // Definición de métodos del repositorio para ProductEntity
  // --- Escritura ---
  save(product: ProductEntity): Promise<ProductEntity>;
  deleteById(id: number, soft?: boolean): Promise<void>;                             // Eliminar  (soft/hard según reglas)
  restoreById(id: number): Promise<ProductEntity>;
  updateStock(id: number, quantity: number): Promise<ProductEntity>;
  decrementStock(id: number, quantity: number): Promise<ProductEntity>;

}