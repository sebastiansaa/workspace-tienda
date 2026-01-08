// --- Stock ---
export class NegativeStockError extends Error {
    constructor(message: string = "El stock no puede ser negativo") {
        super(message);
        this.name = "NegativeStockError";
    }
}

export class InvalidStockError extends Error {
    constructor(message: string = "El stock proporcionado no es válido") {
        super(message);
        this.name = "InvalidStockError";
    }
}

export class StockInsufficientError extends Error {
    constructor(message: string = "No se puede eliminar un producto con stock disponible") {
        super(message);
        this.name = "StockInsufficientError";
    }
}