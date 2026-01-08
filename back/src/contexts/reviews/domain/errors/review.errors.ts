export class ReviewNotFoundError extends Error {
    constructor(message = 'Review not found') {
        super(message);
        this.name = 'ReviewNotFoundError';
    }
}

export class ReviewOwnershipError extends Error {
    constructor(message = 'You can only modify your own reviews') {
        super(message);
        this.name = 'ReviewOwnershipError';
    }
}

export class ReviewProductNotFoundError extends Error {
    constructor(message = 'Product not found for review') {
        super(message);
        this.name = 'ReviewProductNotFoundError';
    }
}

export class ReviewPurchaseRequiredError extends Error {
    constructor(message = 'Only customers with completed orders can post reviews') {
        super(message);
        this.name = 'ReviewPurchaseRequiredError';
    }
}

export class ReviewDuplicateError extends Error {
    constructor(message = 'You have already reviewed this product') {
        super(message);
        this.name = 'ReviewDuplicateError';
    }
}
