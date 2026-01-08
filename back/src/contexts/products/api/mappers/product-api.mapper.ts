import { SaveProductRequestDto, ListProductsRequestDto, SearchProductsRequestDto } from '../dtos/request';
import { ResponseProductDto } from '../dtos/response';
import { SaveProductCommand, DeleteProductCommand, RestoreProductCommand, UpdateStockCommand } from '../../app/commands';
import { ListProductsQuery, SearchProductsQuery } from '../../app/queries';
import { FindProductByIdQuery, FindLowStockQuery } from '../../app/queries';
import { ProductEntity } from '../../domain/entity/product.entity';

function assertPersisted(entity: ProductEntity): asserts entity is ProductEntity & { id: number } {
    if (entity.id === undefined) {
        throw new Error('ProductEntity no persistida: id indefinido. Persiste la entidad antes de mapearla a ProductResponseDto.');
    }
}

export class ProductApiMapper {
    // Request DTO → Commands
    static toSaveProductCommand(dto: SaveProductRequestDto): SaveProductCommand {
        return new SaveProductCommand({
            id: dto.id,
            title: dto.title,
            slug: dto.slug,
            price: dto.price,
            description: dto.description,
            stock: dto.stock,
            active: dto.active,
            images: dto.images,
            categoryId: dto.categoryId,
        });
    }

    static toDeleteProductCommand(id: number, soft: boolean): DeleteProductCommand {
        return new DeleteProductCommand(id, soft);
    }

    static toRestoreProductCommand(id: number): RestoreProductCommand {
        return new RestoreProductCommand(id);
    }

    static toUpdateStockCommand(id: number, quantity: number): UpdateStockCommand {
        return new UpdateStockCommand(id, quantity);
    }

    // Request DTO → Queries
    static toListProductsQuery(dto?: ListProductsRequestDto): ListProductsQuery {
        return new ListProductsQuery({
            page: dto?.page,
            limit: dto?.limit,
            categoryId: dto?.categoryId,
        });
    }

    static toSearchProductsQuery(dto: SearchProductsRequestDto): SearchProductsQuery {
        return new SearchProductsQuery(dto.query, {
            page: dto.page,
            limit: dto.limit,
        });
    }

    static toFindProductByIdQuery(id: number): FindProductByIdQuery {
        return new FindProductByIdQuery(id);
    }

    static toFindLowStockQuery(threshold: number): FindLowStockQuery {
        return new FindLowStockQuery(threshold);
    }

    // Entity → Response DTO
    static toResponseDto(entity: ProductEntity): ResponseProductDto {
        // Aseguramos en la frontera (mapper) que la entidad está persistida
        // antes de devolver el DTO que exige `id: number`.
        assertPersisted(entity);

        return {
            id: entity.id,
            title: entity.title,
            slug: entity.slug,
            price: entity.price,
            description: entity.description,
            stock: entity.stock,
            active: entity.active,
            images: entity.images,
            categoryId: entity.categoryId,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
            deletedAt: entity.deletedAt ? entity.deletedAt.toISOString() : null,
        };
    }

    static toResponseDtoList(entities: ProductEntity[]): ResponseProductDto[] {
        return entities.map(entity => this.toResponseDto(entity));
    }
}
