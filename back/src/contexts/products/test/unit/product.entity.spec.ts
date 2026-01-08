import { ProductEntity } from 'src/contexts/products/domain/entity/product.entity';

describe('ProductEntity - comportamiento', () => {
    const base = {
        title: 'P',
        slug: 'prod-base-slug',
        price: 10,
        description: '',
        stock: 2,
        active: true,
        images: ['https://example.com/1.jpg'],
        categoryId: 1,
    };

    it('crea producto activo si stock>0 y getters funcionan', () => {
        const p = ProductEntity.create({ ...base });
        expect(p.active).toBe(true);
        expect(p.stock).toBe(2);
        expect(p.canBePurchased()).toBe(true);
    });

    it('marca inactivo si stock=0', () => {
        const p = ProductEntity.create({ ...base, stock: 0 });
        expect(p.active).toBe(false);
        expect(p.canBePurchased()).toBe(false);
    });

    it('permite cambiar precio, slug y título', () => {
        const p = ProductEntity.create({ ...base });
        p.changePrice(5.5);
        expect(p.price).toBeCloseTo(5.5);
        p.rename('Nuevo');
        expect(p.title).toBe('Nuevo');
        p.changeSlug('nuevo-slug');
        expect(p.slug).toBe('nuevo-slug');
    });
});
