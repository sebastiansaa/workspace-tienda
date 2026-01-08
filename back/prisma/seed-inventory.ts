import { PrismaClient } from '@prisma/client';

function randomStock(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function seedInventory(prisma: PrismaClient) {
    const products = await prisma.product.findMany();

    if (products.length === 0) {
        console.log('⚠️ No hay productos para inicializar inventario.');
        return;
    }

    const entries = products.map((product) => ({
        productId: product.id,
        onHand: randomStock(10, 50),
        reserved: 0,
    }));

    const result = await prisma.inventoryItem.createMany({
        data: entries,
        skipDuplicates: true,
    });

    console.log(` Inventario insertado: ${result.count}`);
}