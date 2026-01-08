import OrderIdVO from '../v-o/order-id.vo';
import UserIdVO from '../v-o/user-id.vo';
import OrderStatusVO, { OrderStatusType } from '../v-o/order-status.vo';
import CreatedAtVO from '../v-o/created-at.vo';
import UpdatedAtVO from '../v-o/updated-at.vo';
import TotalAmountVO from '../v-o/total-amount.vo';
import OrderItemEntity, { OrderItemProps } from './order-item.entity';
import { EmptyOrderError, InvalidOrderStateError, OrderOwnershipError } from '../errors/order.errors';

export interface OrderProps {
    id?: string;
    userId: string;
    status?: OrderStatusType;
    items: OrderItemProps[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class OrderEntity {
    private readonly idVO: OrderIdVO;
    private readonly userIdVO: UserIdVO;
    private statusVO: OrderStatusVO;
    private itemsInternal: OrderItemEntity[];
    private createdAtVO: CreatedAtVO;
    private updatedAtVO: UpdatedAtVO;
    private totalVO: TotalAmountVO;

    private constructor(props: OrderProps) {
        this.idVO = new OrderIdVO(props.id);
        this.userIdVO = new UserIdVO(props.userId);
        this.itemsInternal = this.buildItems(props.items);
        if (this.itemsInternal.length === 0) throw new EmptyOrderError();

        this.statusVO = new OrderStatusVO(props.status ?? 'PENDING');
        this.createdAtVO = new CreatedAtVO(props.createdAt);
        this.updatedAtVO = new UpdatedAtVO(props.updatedAt);
        this.totalVO = new TotalAmountVO(this.calculateTotal());
    }

    static create(props: Omit<OrderProps, 'createdAt' | 'updatedAt'>): OrderEntity {
        const now = new Date();
        return new OrderEntity({ ...props, createdAt: now, updatedAt: now });
    }

    static rehydrate(props: OrderProps): OrderEntity {
        return new OrderEntity(props);
    }

    get id(): string {
        return this.idVO.value;
    }

    get userId(): string {
        return this.userIdVO.value;
    }

    get status(): OrderStatusType {
        return this.statusVO.value;
    }

    get items(): OrderItemEntity[] {
        return [...this.itemsInternal];
    }

    get createdAt(): Date {
        return this.createdAtVO.value;
    }

    get updatedAt(): Date {
        return this.updatedAtVO.value;
    }

    get totalAmount(): number {
        return this.totalVO.value;
    }

    markPaid(): void {
        this.transitionTo('PAID');
    }

    markCompleted(): void {
        this.transitionTo('COMPLETED');
    }

    cancel(): void {
        this.transitionTo('CANCELLED');
    }

    assertOwnedBy(userId: string): void {
        if (this.userId !== userId) throw new OrderOwnershipError();
    }

    private transitionTo(next: OrderStatusType): void {
        if (!this.statusVO.canTransitionTo(next)) {
            throw new InvalidOrderStateError();
        }
        this.statusVO = new OrderStatusVO(next);
        this.touch();
    }

    private touch(): void {
        this.updatedAtVO = UpdatedAtVO.now();
        this.totalVO = new TotalAmountVO(this.calculateTotal());
    }

    private calculateTotal(): number {
        return this.itemsInternal.reduce((sum, item) => sum + item.lineTotal, 0);
    }

    private buildItems(items: OrderItemProps[]): OrderItemEntity[] {
        const seen = new Set<number>();
        const entities: OrderItemEntity[] = [];
        for (const item of items) {
            if (seen.has(item.productId)) {
                throw new Error('Duplicate product in order items');
            }
            seen.add(item.productId);
            entities.push(OrderItemEntity.create(item));
        }
        return entities;
    }
}

export default OrderEntity;
