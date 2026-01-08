import { Price } from 'src/contexts/products/domain/v-o/price.vo';
import { InvalidPriceError } from 'src/contexts/products/domain/errors/product.errors';

describe('Price VO', () => {
    it('acepta 0 y valores positivos y formatea a 2 decimales', () => {
        const p0 = new Price(0);
        expect(p0.value).toBe(0);
        const p = new Price(12.345);
        expect(p.value).toBeCloseTo(12.35);
        expect(typeof p.raw).toBe('string');
    });

    it('lanza InvalidPriceError para valores negativos o no numéricos', () => {
        expect(() => new Price(-1)).toThrow(InvalidPriceError);
        expect(() => new Price('abc')).toThrow(InvalidPriceError);
        expect(() => new Price(undefined as any)).toThrow(InvalidPriceError);
    });
});
