import { Test } from '@nestjs/testing';
import { InventoryModule } from '../../inventory.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { INVENTORY_WRITE_REPOSITORY } from '../../constants';
import type { IInventoryWriteRepository } from '../../app/ports/inventory-write.repository';
import { InventoryItemEntity } from '../../domain/entity/inventory-item.entity';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('InventoryPrismaWriteRepository integration (Prisma)', () => {
    let prisma: PrismaService;
    let repo: IInventoryWriteRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [InventoryModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(INVENTORY_WRITE_REPOSITORY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    it('saves an inventory item and persists in DB', async () => {
        const cat = await prisma.category.create({ data: { title: 'WCat', slug: `wcat-${Date.now()}`, image: 'http://example.com/img.jpg' } });
        const prod = await prisma.product.create({ data: { title: 'WP', slug: `wp-${Date.now()}`, price: new (require('@prisma/client').Prisma).Decimal(1), description: '', categoryId: cat.id, stock: 0, images: [] } });

        const entity = new InventoryItemEntity({ productId: prod.id, onHand: 5, reserved: 1 });

        const saved = await repo.save(entity);
        expect(saved.id).toBeDefined();
        expect(saved.productId).toBe(prod.id);
        expect(saved.onHand).toBe(5);

        const found = await prisma.inventoryItem.findUnique({ where: { productId: prod.id } });
        expect(found).not.toBeNull();
        expect(found?.productId).toBe(prod.id);
        expect(found?.onHand).toBe(5);
    });

    it('adds a stock movement row', async () => {
        const cat = await prisma.category.create({ data: { title: 'MvWCat', slug: `mvwcat-${Date.now()}`, image: 'http://example.com/img.jpg' } });
        const prod = await prisma.product.create({ data: { title: 'MvWP', slug: `mvwp-${Date.now()}`, price: new (require('@prisma/client').Prisma).Decimal(1), description: '', categoryId: cat.id, stock: 0, images: [] } });
        const entity = new InventoryItemEntity({ productId: prod.id, onHand: 2, reserved: 0 });
        const movement = entity.increase(3, 'restock');

        await repo.save(entity);
        await repo.addMovement(movement);

        const movements = await prisma.stockMovement.findMany({ where: { productId: prod.id } });
        expect(movements.length).toBe(1);
        expect(movements[0].quantity).toBe(3);
        expect(movements[0].type).toBe('INCREASE');
    });
});
