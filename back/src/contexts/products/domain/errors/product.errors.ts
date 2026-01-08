// --- Nombre ---
export class EmptyTitleError extends Error {
    constructor(message: string = "El nombre no puede estar vacío") {
        super(message);
        this.name = "EmptyTitleError";
    }
}

export class InvalidProductTitleError extends Error {
    constructor(message: string = "El nombre del producto no es válido") {
        super(message);
        this.name = "InvalidProductTitleError";
    }
}

// ---Descripción ---
export class EmptyDescriptionError extends Error {
    constructor(message: string = "La descripción no puede estar vacía") {
        super(message);
        this.name = "EmptyDescriptionError";
    }
}


// --- Slug ---
export class EmptySlugError extends Error {
    constructor(message: string = "El slug no puede estar vacío") {
        super(message);
        this.name = "EmptySlugError";
    }
}

export class InvalidSlugError extends Error {
    constructor(message: string = "El slug no es válido") {
        super(message);
        this.name = "InvalidSlugError";
    }
}

// --- Precio ---
export class NegativePriceError extends Error {
    constructor(message: string = "El precio no puede ser negativo") {
        super(message);
        this.name = "NegativePriceError";
    }
}

export class InvalidPriceError extends Error {
    constructor(message: string = "El precio proporcionado no es válido") {
        super(message);
        this.name = "InvalidPriceError";
    }
}


// --- Imágenes ---
export class ImagesArrayNullError extends Error {
    constructor(message: string = "El array de imágenes no puede ser nulo o indefinido") {
        super(message);
        this.name = "ImagesArrayNullError";
    }
}

export class ImagesArrayEmptyError extends Error {
    constructor(message: string = "El array de imágenes no puede estar vacío") {
        super(message);
        this.name = "ImagesArrayEmptyError";
    }
}

export class InvalidImageUrlError extends Error {
    constructor(message: string = "La URL de la imagen debe ser válida y comenzar con http o https") {
        super(message);
        this.name = "InvalidImageUrlError";
    }
}

export class ImageNotFoundError extends Error {
    constructor(message: string = "La imagen no fue encontrada en el producto") {
        super(message);
        this.name = "ImageNotFoundError";
    }
}

// --- Estado (activo/inactivo) ---
export class DesactiveProductError extends Error {
    constructor(message: string = "El producto ya está desactivado") {
        super(message);
        this.name = "DesactiveProductError";
    }
}

export class ActiveProductError extends Error {
    constructor(message: string = "El producto ya está activo") {
        super(message);
        this.name = "ActiveProductError";
    }
}

// --- Categoría ---
export class InvalidCategoryError extends Error {
    constructor(message: string = "La categoría proporcionada no es válida") {
        super(message);
        this.name = "InvalidCategoryError";
    }
}

// --- Producto con stock ---
//error expresa una regla de negocio del  Producto, entonces es más correcto dejarlo
export class ProductHasStockError extends Error {
    constructor(message: string = "El producto tiene stock y no se puede eliminar") {
        super(message);
        this.name = "ProductHasStockError";
    }
}