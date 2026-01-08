import { StockEntity } from 'src/contexts/products/domain/entity/stock.entity';

describe('StockEntity - reglas', () => {
    it('no permite stock negativo y reporta valor numérico', () => {
        const s = new StockEntity(5);
        expect(s.value).toBe(5);
        s.set(0);
        expect(s.isEmpty()).toBe(true);
    });

    it('lanza al setear negativo', () => {
        const s = new StockEntity(1);
        expect(() => s.set(-3)).toThrow();
    });
});
