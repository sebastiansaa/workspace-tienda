import ProductPrismaWriteRepository from 'src/contexts/products/infra/persistence/product-prisma-write.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductEntity } from 'src/contexts/products/domain/entity/product.entity';
import { ensureTestEnv } from 'src/test-utils/prisma-test-helpers';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('ProductPrismaWriteRepository - integration', () => {
    let prisma: PrismaService;
    let repo: ProductPrismaWriteRepository;
    let categoryId: number;

    beforeAll(async () => {
        prisma = new PrismaService();
        await prisma.$connect();
        const cat = await prisma.category.create({ data: { title: 'int-cat', slug: `int-cat-${Date.now()}`, image: 'img' } });
        categoryId = cat.id;
        repo = new ProductPrismaWriteRepository(prisma as any);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('crea y limpia producto en la DB real', async () => {
        const entity = ProductEntity.create({
            title: 'Int Prod',
            slug: `int-prod-${Date.now()}`,
            price: 12.5,
            description: 'd',
            stock: 1,
            active: true,
            images: ['https://example.com/1.jpg'],
            categoryId,
        });

        const saved = await repo.save(entity);
        expect(saved.id).toBeDefined();
        expect(saved.title).toBe('Int Prod');

        // cleanup
        await prisma.product.delete({ where: { id: saved.id! } });
        await prisma.category.delete({ where: { id: categoryId } });
    });
});
