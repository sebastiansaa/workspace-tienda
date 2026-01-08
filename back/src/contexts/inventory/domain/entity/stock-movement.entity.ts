import MovementTypeVO, { MovementType } from '../v-o/movement-type.vo';
import MovementReasonVO from '../v-o/movement-reason.vo';
import QuantityVO from '../v-o/quantity.vo';
import CreatedAtVO from '../v-o/created-at.vo';
import InventoryItemIdVO from '../v-o/inventory-item-id.vo';
import ProductIdVO from '../v-o/product-id.vo';
import StockMovementIdVO from '../v-o/stock-movement-id.vo';

export interface StockMovementProps {
    id?: string;
    inventoryItemId: string;
    productId: number;
    type: MovementType;
    reason: string;
    quantity: number;
    onHandAfter: number;
    reservedAfter: number;
    createdAt?: Date;
}

export class StockMovementEntity {
    private readonly idVO: StockMovementIdVO;
    private readonly inventoryItemIdVO: InventoryItemIdVO;
    private readonly productIdVO: ProductIdVO;
    private readonly typeVO: MovementTypeVO;
    private readonly reasonVO: MovementReasonVO;
    private readonly quantityVO: QuantityVO;
    private readonly createdAtVO: CreatedAtVO;
    private readonly onHandAfterInternal: number;
    private readonly reservedAfterInternal: number;

    constructor(props: StockMovementProps) {
        this.idVO = new StockMovementIdVO(props.id);
        this.inventoryItemIdVO = new InventoryItemIdVO(props.inventoryItemId);
        this.productIdVO = new ProductIdVO(props.productId);
        this.typeVO = new MovementTypeVO(props.type);
        this.reasonVO = new MovementReasonVO(props.reason);
        this.quantityVO = new QuantityVO(props.quantity);
        this.createdAtVO = new CreatedAtVO(props.createdAt);
        this.onHandAfterInternal = props.onHandAfter;
        this.reservedAfterInternal = props.reservedAfter;
    }

    get id(): string {
        return this.idVO.value;
    }

    get inventoryItemId(): string {
        return this.inventoryItemIdVO.value;
    }

    get productId(): number {
        return this.productIdVO.value;
    }

    get type(): MovementType {
        return this.typeVO.value;
    }

    get reason(): string {
        return this.reasonVO.value;
    }

    get quantity(): number {
        return this.quantityVO.value;
    }

    get onHandAfter(): number {
        return this.onHandAfterInternal;
    }

    get reservedAfter(): number {
        return this.reservedAfterInternal;
    }

    get createdAt(): Date {
        return this.createdAtVO.value;
    }
}

export default StockMovementEntity;
