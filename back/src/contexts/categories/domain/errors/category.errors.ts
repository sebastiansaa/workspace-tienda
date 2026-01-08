export class CategoryNotFoundError extends Error {
    constructor(message = 'Category not found') {
        super(message);
        this.name = 'CategoryNotFoundError';
    }
}

export class DuplicateCategoryError extends Error {
    constructor(message = 'Category already exists') {
        super(message);
        this.name = 'DuplicateCategoryError';
    }
}

export class InvalidSortOrderError extends Error {
    constructor(message = 'Sort order must be a non-negative integer') {
        super(message);
        this.name = 'InvalidSortOrderError';
    }
}

export default {
    CategoryNotFoundError,
    DuplicateCategoryError,
    InvalidSortOrderError,
};