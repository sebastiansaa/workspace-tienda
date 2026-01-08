import { Test } from '@nestjs/testing';
import { InventoryModule } from '../../inventory.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { cleanDatabase, ensureTestEnv } from 'src/test-utils/prisma-test-helpers';
import { INVENTORY_READ_REPOSITORY } from '../../constants';
import type { IInventoryReadRepository } from '../../app/ports/inventory-read.repository';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('InventoryPrismaReadRepository integration (Prisma)', () => {
    let prisma: PrismaService;
    let repo: IInventoryReadRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [InventoryModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(INVENTORY_READ_REPOSITORY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    it('findByProductId returns mapped InventoryItemEntity', async () => {
        const cat = await prisma.category.create({ data: { title: 'ItCat', slug: `itcat-${Date.now()}`, image: 'http://example.com/img.jpg' } });
        const prod = await prisma.product.create({ data: { title: 'ItP', slug: `itp-${Date.now()}`, price: new (require('@prisma/client').Prisma).Decimal(1), description: '', categoryId: cat.id, stock: 0, images: [] } });
        const created = await prisma.inventoryItem.create({ data: { productId: prod.id, onHand: 7, reserved: 2 } });

        const item = await repo.findByProductId(prod.id);
        expect(item).not.toBeNull();
        expect(item?.productId).toBe(prod.id);
        expect(item?.onHand).toBe(7);
        expect(item?.reserved).toBe(2);
    });

    it('listMovements returns mapped StockMovementEntity ordered by createdAt desc', async () => {
        const cat = await prisma.category.create({ data: { title: 'MvCat', slug: `mvcat-${Date.now()}`, image: 'http://example.com/img.jpg' } });
        const prod = await prisma.product.create({ data: { title: 'MvP', slug: `mvp-${Date.now()}`, price: new (require('@prisma/client').Prisma).Decimal(1), description: '', categoryId: cat.id, stock: 0, images: [] } });
        const inv = await prisma.inventoryItem.create({ data: { productId: prod.id, onHand: 1, reserved: 0 } });
        await prisma.stockMovement.create({ data: { productId: prod.id, type: 'INCREASE', quantity: 1, reason: 'r', inventoryItemId: inv.id, onHandAfter: 1, reservedAfter: 0 } });
        await prisma.stockMovement.create({ data: { productId: prod.id, type: 'DECREASE', quantity: 1, reason: 'r2', inventoryItemId: inv.id, onHandAfter: 0, reservedAfter: 0 } });

        const movements = await repo.listMovements(prod.id);
        expect(movements.length).toBe(2);
        // first element should be the most recent (createdAt desc)
        expect(movements[0].type).toBe('DECREASE');
        expect(movements[1].type).toBe('INCREASE');
    });
});
