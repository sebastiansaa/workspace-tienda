import { Injectable } from '@nestjs/common';
import { ProductAdminPort } from '../../../shared/ports/admin/product-admin.port';
import {
    DeleteProductUsecase,
    FindLowStockUsecase,
    RestoreProductUsecase,
    SaveProductUsecase,
    UpdateStockUsecase,
} from '../../app/usecases/index';
import { ProductApiMapper } from '../../api/mappers/product-api.mapper';
import type { SaveProductRequestDto } from '../../api/dtos/request/save-product.request.dto';
import type { ResponseProductDto } from '../../api/dtos/response/response-product.dto';

@Injectable()
export class ProductAdminAdapter implements ProductAdminPort {
    constructor(
        private readonly saveProductUsecase: SaveProductUsecase,
        private readonly updateStockUsecase: UpdateStockUsecase,
        private readonly deleteProductUsecase: DeleteProductUsecase,
        private readonly restoreProductUsecase: RestoreProductUsecase,
        private readonly findLowStockUsecase: FindLowStockUsecase,
    ) { }

    async save(dto: SaveProductRequestDto): Promise<ResponseProductDto> {
        const command = ProductApiMapper.toSaveProductCommand(dto);
        const product = await this.saveProductUsecase.execute(command);
        return ProductApiMapper.toResponseDto(product);
    }

    async updateStock(id: number, quantity: number): Promise<ResponseProductDto> {
        const command = ProductApiMapper.toUpdateStockCommand(id, quantity);
        const product = await this.updateStockUsecase.execute(command);
        return ProductApiMapper.toResponseDto(product);
    }

    async delete(id: number, softDelete: boolean): Promise<void> {
        const command = ProductApiMapper.toDeleteProductCommand(id, softDelete);
        await this.deleteProductUsecase.execute(command);
    }

    async restore(id: number): Promise<ResponseProductDto> {
        const command = ProductApiMapper.toRestoreProductCommand(id);
        const product = await this.restoreProductUsecase.execute(command);
        return ProductApiMapper.toResponseDto(product);
    }

    async findLowStock(threshold: number): Promise<ResponseProductDto[]> {
        const query = ProductApiMapper.toFindLowStockQuery(threshold);
        const products = await this.findLowStockUsecase.execute(query);
        return ProductApiMapper.toResponseDtoList(products);
    }
}
