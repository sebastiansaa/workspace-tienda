import { InvalidPriceError } from '../errors/product.errors';

export class Price {
    private readonly _value: string; // almacenamos como string para evitar errores de redondeo

    constructor(value: unknown) {
        //validaciones
        //El obj no puede ser nulo o undefined
        if (value === undefined || value === null) {
            throw new InvalidPriceError('Invariant: price es obligatorio');
        }

        let stringValue: string;
        if (typeof value === 'object' && value !== null && 'toNumber' in value) {
            stringValue = (value as { toNumber(): number }).toNumber().toString();
        } else {
            stringValue = String(value);
        }

        const numeric = parseFloat(stringValue);
        if (isNaN(numeric) || numeric < 0) {
            throw new InvalidPriceError('Invariant: price debe ser un número positivo');
        }

        this._value = numeric.toFixed(2);
    }

    get value(): number {
        return parseFloat(this._value);
    }

    get raw(): string {
        return this._value; // útil para persistir en DB
    }

    equals(other: Price): boolean {
        return this._value === other._value;
    }
}