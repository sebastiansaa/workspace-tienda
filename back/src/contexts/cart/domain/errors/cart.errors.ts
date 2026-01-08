export class CartNotFoundError extends Error {
    constructor(message = 'Cart not found') {
        super(message);
        this.name = 'CartNotFoundError';
    }
}

export class CartItemNotFoundError extends Error {
    constructor(message = 'Cart item not found') {
        super(message);
        this.name = 'CartItemNotFoundError';
    }
}

export class DuplicateCartItemError extends Error {
    constructor(message = 'Product already in cart') {
        super(message);
        this.name = 'DuplicateCartItemError';
    }
}

export class InvalidQuantityError extends Error {
    constructor(message = 'Quantity must be greater than zero') {
        super(message);
        this.name = 'InvalidQuantityError';
    }
}

export class InvalidProductError extends Error {
    constructor(message = 'Invalid product') {
        super(message);
        this.name = 'InvalidProductError';
    }
}

export class InsufficientStockError extends Error {
    constructor(message = 'Insufficient stock') {
        super(message);
        this.name = 'InsufficientStockError';
    }
}
