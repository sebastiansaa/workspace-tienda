import InventoryItemIdVO from '../v-o/inventory-item-id.vo';
import ProductIdVO from '../v-o/product-id.vo';
import NonNegativeQuantityVO from '../v-o/non-negative-quantity.vo';
import QuantityVO from '../v-o/quantity.vo';
import CreatedAtVO from '../v-o/created-at.vo';
import UpdatedAtVO from '../v-o/updated-at.vo';
import { InsufficientStockError, InvalidMovementError, NegativeStockError } from '../errors/inventory.errors';
import StockMovementEntity from './stock-movement.entity';
import { MovementType } from '../v-o/movement-type.vo';

export interface InventoryItemProps {
    id?: string;
    productId: number;
    onHand?: number;
    reserved?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class InventoryItemEntity {
    private readonly idVO: InventoryItemIdVO;
    private readonly productIdVO: ProductIdVO;
    private onHandVO: NonNegativeQuantityVO;
    private reservedVO: NonNegativeQuantityVO;
    private createdAtVO: CreatedAtVO;
    private updatedAtVO: UpdatedAtVO;

    constructor(props: InventoryItemProps) {
        this.idVO = new InventoryItemIdVO(props.id);
        this.productIdVO = new ProductIdVO(props.productId);
        this.onHandVO = new NonNegativeQuantityVO(props.onHand ?? 0);
        this.reservedVO = new NonNegativeQuantityVO(props.reserved ?? 0);
        if (this.reservedVO.value > this.onHandVO.value) {
            throw new NegativeStockError('Reserved cannot exceed on-hand');
        }
        this.createdAtVO = new CreatedAtVO(props.createdAt);
        this.updatedAtVO = new UpdatedAtVO(props.updatedAt);
    }

    get id(): string {
        return this.idVO.value;
    }

    get productId(): number {
        return this.productIdVO.value;
    }

    get onHand(): number {
        return this.onHandVO.value;
    }

    get reserved(): number {
        return this.reservedVO.value;
    }

    get available(): number {
        return this.onHandVO.value - this.reservedVO.value;
    }

    get createdAt(): Date {
        return this.createdAtVO.value;
    }

    get updatedAt(): Date {
        return this.updatedAtVO.value;
    }

    increase(quantity: number, reason: string): StockMovementEntity {
        const qty = new QuantityVO(quantity);
        this.onHandVO = new NonNegativeQuantityVO(this.onHandVO.value + qty.value);
        this.touch();
        return this.movement('INCREASE', qty.value, reason);
    }

    decrease(quantity: number, reason: string): StockMovementEntity {
        const qty = new QuantityVO(quantity);
        if (this.available < qty.value) throw new InsufficientStockError();
        this.onHandVO = new NonNegativeQuantityVO(this.onHandVO.value - qty.value);
        if (this.onHandVO.value < this.reservedVO.value) {
            throw new NegativeStockError();
        }
        this.touch();
        return this.movement('DECREASE', qty.value, reason);
    }

    reserve(quantity: number, reason: string): StockMovementEntity {
        const qty = new QuantityVO(quantity);
        if (this.available < qty.value) throw new InsufficientStockError();
        this.reservedVO = new NonNegativeQuantityVO(this.reservedVO.value + qty.value);
        this.touch();
        return this.movement('RESERVATION', qty.value, reason);
    }

    release(quantity: number, reason: string): StockMovementEntity {
        const qty = new QuantityVO(quantity);
        if (qty.value > this.reservedVO.value) throw new InvalidMovementError('Release exceeds reserved stock');
        this.reservedVO = new NonNegativeQuantityVO(this.reservedVO.value - qty.value);
        this.touch();
        return this.movement('RELEASE', qty.value, reason);
    }

    private movement(type: MovementType, quantity: number, reason: string): StockMovementEntity {
        return new StockMovementEntity({
            inventoryItemId: this.id,
            productId: this.productId,
            type,
            reason,
            quantity,
            onHandAfter: this.onHandVO.value,
            reservedAfter: this.reservedVO.value,
        });
    }

    private touch(): void {
        this.updatedAtVO = UpdatedAtVO.now();
    }
}

export default InventoryItemEntity;
