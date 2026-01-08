import type { SaveProductRequestDto } from '../../../products/api/dtos/request/save-product.request.dto';
import type { ResponseProductDto } from '../../../products/api/dtos/response/response-product.dto';

export interface ProductAdminPort {
    save(dto: SaveProductRequestDto): Promise<ResponseProductDto>;
    updateStock(id: number, quantity: number): Promise<ResponseProductDto>;
    delete(id: number, softDelete: boolean): Promise<void>;
    restore(id: number): Promise<ResponseProductDto>;
    findLowStock(threshold: number): Promise<ResponseProductDto[]>;
}
