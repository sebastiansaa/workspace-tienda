import { PrismaClient } from '@prisma/client';

import { seedUsers } from './seed-user';
import { seedCategories } from './seed-category';
import { seedProducts } from './seed-product';
import { seedInventory } from './seed-inventory';

const prisma = new PrismaClient();

async function main() {
    console.log(' Ejecutando seeds por contexto...');

    await seedUsers(prisma);
    await seedCategories(prisma);
    await seedProducts(prisma);
    await seedInventory(prisma);

    console.log(' Seeds completados');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });