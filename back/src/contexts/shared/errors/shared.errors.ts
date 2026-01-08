export class InvalidTitleError extends Error {
    constructor(message: string = "El nombre no puede estar vacío") {
        super(message);
        this.name = "InvalidTitleError";
    }
}

export class InvalidImageUrlError extends Error {
    constructor(message: string = "La URL de la imagen debe ser válida y comenzar con http o https") {
        super(message);
        this.name = "InvalidImageUrlError";
    }
}

export class InvalidSlugError extends Error {
    constructor(message: string = "El slug no es válido") {
        super(message);
        this.name = "InvalidSlugError";
    }
}

export class InvalidEmailError extends Error {
    constructor(message: string = "El email no es válido") {
        super(message);
        this.name = "InvalidEmailError";
    }
}
