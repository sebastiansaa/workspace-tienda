import { EmptyDescriptionError } from "../errors";

export class Description {
    private readonly valor: string;

    constructor(valor: string) {
        if (valor === undefined || valor === null) {
            throw new EmptyDescriptionError();
        }
        this.valor = valor.trim();
    }

    get value(): string {
        return this.valor;
    }
}

export default Description;
