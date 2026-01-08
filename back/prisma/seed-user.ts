import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedUsers(prisma: PrismaClient) {
    const adminHash = await bcrypt.hash('Admin123!', 10);
    const userHash = await bcrypt.hash('User123!', 10);

    const result = await prisma.user.createMany({
        data: [
            {
                email: 'admin@example.com',
                passwordHash: adminHash,
                roles: ['admin'],
            },
            {
                email: 'user@example.com',
                passwordHash: userHash,
                roles: ['user'],
            },
        ],
        skipDuplicates: true,
    });

    console.log(` Usuarios insertados: ${result.count}`);
}