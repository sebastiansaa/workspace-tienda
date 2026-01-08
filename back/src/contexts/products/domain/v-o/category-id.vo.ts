import { InvalidCategoryError } from '../errors';

export class CategoryId {
    private readonly valor: number;

    constructor(valor: number) {
        if (!Number.isInteger(valor) || valor <= 0) {
            throw new InvalidCategoryError();
        }
        this.valor = valor;
    }

    get value(): number {
        return this.valor;
    }
}

export default CategoryId;
