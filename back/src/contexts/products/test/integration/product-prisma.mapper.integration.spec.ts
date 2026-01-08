import ProductPrismaMapper from 'src/contexts/products/infra/mappers/product-prisma.mapper';

describe('ProductPrismaMapper - toDomain/toReadDto', () => {
    it('mapea fila simulada a dominio y DTO', () => {
        const row = {
            id: 123,
            title: 'P',
            slug: 'prod-slug-123',
            price: '99.50',
            description: 'd',
            stock: 5,
            active: true,
            images: ['https://example.com/1.jpg'],
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        } as any;

        const domain = ProductPrismaMapper.toDomain(row);
        expect(domain).not.toBeNull();
        if (domain) expect(domain.price).toBeCloseTo(99.5);

        const dto = ProductPrismaMapper.toReadDto(row);
        expect(dto).not.toBeNull();
        if (dto) expect(dto.price).toBeCloseTo(99.5);
    });
});
