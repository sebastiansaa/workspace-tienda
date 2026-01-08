import ProductIdVO from '../v-o/product-id.vo';
import QuantityVO from '../v-o/quantity.vo';
import PriceVO from '../v-o/price.vo';

export interface CartItemProps {
    productId: number;
    quantity: number;
    price: number;
}

export class CartItemEntity {
    private productIdVO: ProductIdVO;
    private quantityVO: QuantityVO;
    private priceVO: PriceVO;

    private constructor(props: CartItemProps) {
        this.productIdVO = new ProductIdVO(props.productId);
        this.quantityVO = new QuantityVO(props.quantity);
        this.priceVO = new PriceVO(props.price);
    }

    static create(props: CartItemProps): CartItemEntity {
        return new CartItemEntity(props);
    }

    static rehydrate(props: CartItemProps): CartItemEntity {
        return new CartItemEntity(props);
    }

    get productId(): number {
        return this.productIdVO.value;
    }

    get quantity(): number {
        return this.quantityVO.value;
    }

    get price(): number {
        return this.priceVO.value;
    }

    get lineTotal(): number {
        return this.priceVO.value * this.quantityVO.value;
    }

    updateQuantity(quantity: number): void {
        this.quantityVO = new QuantityVO(quantity);
    }

    withPrice(price: number): CartItemEntity {
        return CartItemEntity.create({ productId: this.productId, quantity: this.quantity, price });
    }
}

export default CartItemEntity;
