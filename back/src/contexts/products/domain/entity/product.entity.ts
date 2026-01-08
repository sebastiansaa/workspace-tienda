import {
    ActiveProductError,
    DesactiveProductError,
    ProductHasStockError,
} from '../errors';
import { ProductProps } from './productPropInterface';
import { Slug, SoftDeleteVO } from '../../../shared/v-o';
import { Price, Title, ImagesVO, Description, CategoryId, StockVO } from '../v-o';

/**
 * Entidad de Dominio Product.
 * Representa un producto del catálogo y encapsula todas las reglas de negocio, 
 * asegurando la integridad de los datos mediante el uso de Value Objects.
 */
export class ProductEntity {
    private readonly idValue?: number;
    private titleVO: Title;
    private slugVO: Slug;
    private priceVO: Price;
    private descriptionVO: Description;
    private stockVO: StockVO;
    private imagesVO: ImagesVO;
    private deletedAtVO: SoftDeleteVO;
    private categoryIdVO: CategoryId;
    private createdAtValue: Date;
    private updatedAtValue: Date;

    private constructor(props: ProductProps) {
        this.idValue = props.id;
        this.titleVO = new Title(props.title);
        this.slugVO = new Slug(props.slug);
        this.priceVO = new Price(props.price);
        this.descriptionVO = new Description(props.description ?? '');
        this.stockVO = StockVO.from(props.stock);
        // Maneja el estado de borrado lógico (active/inactive)
        this.deletedAtVO = new SoftDeleteVO(props.deletedAt ?? (props.active === false ? new Date() : undefined));
        this.imagesVO = new ImagesVO(props.images);
        this.categoryIdVO = new CategoryId(props.categoryId);
        const now = new Date();
        this.createdAtValue = props.createdAt ?? now;
        this.updatedAtValue = props.updatedAt ?? now;

        // Regla de negocio: si no hay stock, el producto se marca como inactivo automáticamente
        if (this.stockVO.isEmpty()) this.markAsInactive();
    }

    /**
     * Crea una nueva instancia de producto con fechas inicializadas.
     */
    static create(props: Omit<ProductProps, 'createdAt' | 'updatedAt' | 'deletedAt'> & { deletedAt?: Date | null }): ProductEntity {
        const now = new Date();
        return new ProductEntity({
            ...props,
            createdAt: now,
            updatedAt: now,
        });
    }

    /**
     * Reconstituye una entidad desde datos persistidos (mantenimiento de estado).
     */
    static rehydrate(props: ProductProps): ProductEntity {
        return new ProductEntity(props);
    }

    /**
     * Realiza un borrado lógico del producto. 
     * Valida que no tenga stock para evitar inconsistencias en el catálogo.
     */
    remove(): void {
        if (!this.active) throw new DesactiveProductError();
        if (!this.stockVO.isEmpty()) throw new ProductHasStockError('No puedes eliminar un producto con stock');
        this.deletedAtVO = this.deletedAtVO.delete();
        this.touch();
    }

    /**
     * Restaura un producto inactivo.
     */
    restore(): void {
        if (this.active) throw new ActiveProductError();
        this.deletedAtVO = this.deletedAtVO.restore();
        this.touch();
    }

    /**
     * Verifica si el producto es apto para la venta (activo y con existencias).
     */
    canBePurchased(): boolean {
        return this.active && !this.stockVO.isEmpty();
    }

    // Métodos de mutación controlada que garantizan que el estado interno sea siempre válido

    changePrice(newPrice: number | string): void {
        this.priceVO = new Price(newPrice);
        this.touch();
    }

    changeSlug(newSlug: string): void {
        this.slugVO = new Slug(newSlug);
        this.touch();
    }

    rename(newTitle: string): void {
        this.titleVO = new Title(newTitle);
        this.touch();
    }

    changeDescription(newDescription: string): void {
        this.descriptionVO = new Description(newDescription ?? '');
        this.touch();
    }

    addImage(url: string): void {
        this.imagesVO = this.imagesVO.add(url);
        this.touch();
    }

    removeImage(url: string): void {
        this.imagesVO = this.imagesVO.remove(url);
        this.touch();
    }

    replaceImages(urls: string[]): void {
        this.imagesVO = this.imagesVO.replace(urls);
        this.touch();
    }

    setStock(quantity: number): void {
        this.stockVO.set(quantity);
        this.touch();
    }

    private markAsInactive(): void {
        this.deletedAtVO = this.deletedAtVO.delete();
    }

    /**
     * Actualiza la fecha de modificación de la entidad.
     */
    private touch(): void {
        this.updatedAtValue = new Date();
    }

    // Getters públicos que devuelven tipos primitivos para facilitar su uso fuera del dominio
    get id(): number | undefined { return this.idValue; }
    get title(): string { return this.titleVO.value; }
    get slug(): string { return this.slugVO.value; }
    get price(): number { return this.priceVO.value; }
    get description(): string { return this.descriptionVO.value; }
    get stock(): number { return this.stockVO.value; }
    get categoryId(): number { return this.categoryIdVO.value; }
    get createdAt(): Date { return this.createdAtValue; }
    get updatedAt(): Date { return this.updatedAtValue; }
    get active(): boolean { return !this.deletedAtVO.isDeleted(); }
    get deletedAt(): Date | undefined { return this.deletedAtVO.value; }
    get images(): string[] { return this.imagesVO.values; }
}
