import CartIdVO from '../v-o/cart-id.vo';
import UserIdVO from '../v-o/user-id.vo';
import CartItemEntity, { CartItemProps } from './cart-item.entity';
import { DuplicateCartItemError, CartItemNotFoundError } from '../errors/cart.errors';

export interface CartProps {
    id?: string;
    userId: string;
    items?: CartItemProps[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class CartEntity {
    private readonly idVO: CartIdVO;
    private readonly userIdVO: UserIdVO;
    private itemsInternal: CartItemEntity[];
    private createdAtInternal: Date;
    private updatedAtInternal: Date;

    private constructor(props: CartProps) {
        this.idVO = new CartIdVO(props.id);
        this.userIdVO = new UserIdVO(props.userId);
        this.itemsInternal = (props.items ?? []).map((i) => CartItemEntity.rehydrate(i));
        const now = new Date();
        this.createdAtInternal = props.createdAt ?? now;
        this.updatedAtInternal = props.updatedAt ?? now;
    }

    static create(props: Omit<CartProps, 'createdAt' | 'updatedAt'>): CartEntity {
        const now = new Date();
        return new CartEntity({ ...props, createdAt: now, updatedAt: now });
    }

    static rehydrate(props: CartProps): CartEntity {
        return new CartEntity(props);
    }

    get id(): string {
        return this.idVO.value;
    }

    get userId(): string {
        return this.userIdVO.value;
    }

    get items(): CartItemEntity[] {
        return [...this.itemsInternal];
    }

    get createdAt(): Date {
        return this.createdAtInternal;
    }

    get updatedAt(): Date {
        return this.updatedAtInternal;
    }

    addItem(item: CartItemEntity): void {
        if (this.itemsInternal.some((i) => i.productId === item.productId)) {
            throw new DuplicateCartItemError();
        }
        this.itemsInternal = [...this.itemsInternal, item];
        this.touch();
    }

    removeItem(productId: number): void {
        const exists = this.itemsInternal.some((i) => i.productId === productId);
        if (!exists) throw new CartItemNotFoundError();
        this.itemsInternal = this.itemsInternal.filter((i) => i.productId !== productId);
        this.touch();
    }

    updateQuantity(productId: number, quantity: number): void {
        const idx = this.itemsInternal.findIndex((i) => i.productId === productId);
        if (idx === -1) throw new CartItemNotFoundError();
        const current = this.itemsInternal[idx];
        current.updateQuantity(quantity);
        this.touch();
    }

    repriceItem(productId: number, price: number): void {
        const idx = this.itemsInternal.findIndex((i) => i.productId === productId);
        if (idx === -1) throw new CartItemNotFoundError();
        const current = this.itemsInternal[idx];
        this.itemsInternal[idx] = current.withPrice(price);
        this.touch();
    }

    clear(): void {
        this.itemsInternal = [];
        this.touch();
    }

    calculateTotal(): number {
        return this.itemsInternal.reduce((sum, item) => sum + item.lineTotal, 0);
    }

    private touch(): void {
        this.updatedAtInternal = new Date();
    }
}
