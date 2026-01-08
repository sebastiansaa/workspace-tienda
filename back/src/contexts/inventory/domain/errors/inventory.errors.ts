export class InsufficientStockError extends Error {
    constructor(message = 'Insufficient stock available') {
        super(message);
        this.name = 'InsufficientStockError';
    }
}

export class InvalidMovementError extends Error {
    constructor(message = 'Invalid stock movement') {
        super(message);
        this.name = 'InvalidMovementError';
    }
}

export class NegativeStockError extends Error {
    constructor(message = 'Stock cannot be negative') {
        super(message);
        this.name = 'NegativeStockError';
    }
}
