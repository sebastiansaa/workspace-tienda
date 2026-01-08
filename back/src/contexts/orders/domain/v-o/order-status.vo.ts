export type OrderStatusType = 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED';

const allowedTransitions: Record<OrderStatusType, OrderStatusType[]> = {
    PENDING: ['PAID', 'CANCELLED'],
    PAID: ['COMPLETED'],
    CANCELLED: [],
    COMPLETED: [],
};

export class OrderStatusVO {
    private readonly _value: OrderStatusType;

    constructor(value: OrderStatusType) {
        this._value = value;
    }

    get value(): OrderStatusType {
        return this._value;
    }

    canTransitionTo(next: OrderStatusType): boolean {
        return allowedTransitions[this._value].includes(next);
    }
}

export default OrderStatusVO;
