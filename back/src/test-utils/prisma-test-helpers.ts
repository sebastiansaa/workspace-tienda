// expone cleanDatabase y verifica que corra en entorno de test. 
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

let envLoaded = false;

export function ensureTestEnv(): boolean {
    if (!envLoaded) {
        const envPath = path.resolve('.env.test');
        if (fs.existsSync(envPath)) {
            dotenv.config({ path: envPath });
        }
        envLoaded = true;
    }
    return Boolean(process.env.DATABASE_URL);
}

export async function cleanDatabase(prisma: PrismaClient): Promise<void> {
    await prisma.stockMovement.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.address.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
}
