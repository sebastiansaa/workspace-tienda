export class InvalidOrderStateError extends Error {
    constructor(message = 'Invalid order state transition') {
        super(message);
        this.name = 'InvalidOrderStateError';
    }
}

export class EmptyOrderError extends Error {
    constructor(message = 'Order must contain at least one item') {
        super(message);
        this.name = 'EmptyOrderError';
    }
}

export class InvalidQuantityError extends Error {
    constructor(message = 'Quantity must be greater than zero') {
        super(message);
        this.name = 'InvalidQuantityError';
    }
}

export class ProductUnavailableError extends Error {
    constructor(message = 'Product is unavailable') {
        super(message);
        this.name = 'ProductUnavailableError';
    }
}

export class OrderOwnershipError extends Error {
    constructor(message = 'You are not allowed to access this order') {
        super(message);
        this.name = 'OrderOwnershipError';
    }
}
