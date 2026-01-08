import { CategoryProps } from "../interfaces/category.props";
import { TitleVO, Slug, ImageUrlVO, SoftDeleteVO } from "../../../shared/v-o";
import { InvalidSortOrderError } from "../errors/category.errors";

export class CategoryEntity {
    private readonly idValue?: number;
    private titleVO: TitleVO;
    private slugVO: Slug;
    private imageVO: ImageUrlVO;
    private descriptionValue?: string;
    private sortOrderValue: number;
    private deletedAtVO: SoftDeleteVO;
    private createdAtValue: Date;
    private updatedAtValue: Date;

    private constructor(props: CategoryProps) {
        this.idValue = props.id;
        this.titleVO = new TitleVO(props.title);
        this.slugVO = new Slug(props.slug);
        this.imageVO = new ImageUrlVO(props.image);
        this.descriptionValue = props.description;
        this.sortOrderValue = this.ensureValidSortOrder(props.sortOrder ?? 0);
        this.deletedAtVO = new SoftDeleteVO(props.deletedAt ?? (props.active === false ? new Date() : undefined));
        const now = new Date();
        this.createdAtValue = props.createdAt ?? now;
        this.updatedAtValue = props.updatedAt ?? now;
    }

    static create(props: Omit<CategoryProps, 'createdAt' | 'updatedAt' | 'deletedAt'> & { deletedAt?: Date | null }): CategoryEntity {
        const now = new Date();
        return new CategoryEntity({
            ...props,
            createdAt: now,
            updatedAt: now,
        });
    }

    static rehydrate(props: CategoryProps): CategoryEntity {
        return new CategoryEntity(props);
    }

    update(props: Partial<CategoryProps>): void {
        if (props.title !== undefined) this.titleVO = new TitleVO(props.title);
        if (props.slug !== undefined) this.slugVO = new Slug(props.slug);
        if (props.image !== undefined) this.imageVO = new ImageUrlVO(props.image);
        if (props.description !== undefined) this.descriptionValue = props.description;
        if (props.active !== undefined) {
            if (props.active && this.deletedAtVO.isDeleted()) this.restore();
            if (!props.active && !this.deletedAtVO.isDeleted()) this.delete();
        }
        if (props.sortOrder !== undefined) this.sortOrderValue = this.ensureValidSortOrder(props.sortOrder);
        this.touch();
    }

    delete(): void {
        this.deletedAtVO = this.deletedAtVO.delete();
        this.touch();
    }

    restore(): void {
        this.deletedAtVO = this.deletedAtVO.restore();
        this.touch();
    }

    get id(): number | undefined { return this.idValue; }
    get title(): string { return this.titleVO.value; }
    get slug(): string { return this.slugVO.value; }
    get image(): string { return this.imageVO.value; }
    get description(): string | undefined { return this.descriptionValue; }
    get sortOrder(): number { return this.sortOrderValue; }
    get active(): boolean { return !this.deletedAtVO.isDeleted(); }
    get deletedAt(): Date | undefined { return this.deletedAtVO.value; }
    get createdAt(): Date { return this.createdAtValue; }
    get updatedAt(): Date { return this.updatedAtValue; }

    private ensureValidSortOrder(value: number): number {
        if (!Number.isInteger(value) || value < 0) throw new InvalidSortOrderError();
        return value;
    }

    private touch(): void {
        this.updatedAtValue = new Date();
    }
}
