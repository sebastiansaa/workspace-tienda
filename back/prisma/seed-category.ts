import { PrismaClient } from '@prisma/client';

export async function seedCategories(prisma: PrismaClient) {
    const result = await prisma.category.createMany({
        data: [
            {
                title: 'Ropa',
                slug: 'ropa',
                image: 'https://example.com/categorias/ropa.jpg',
                description: 'Prendas y accesorios',
                sortOrder: 1,
            },
            {
                title: 'Tecnologia',
                slug: 'tecnologia',
                image: 'https://example.com/categorias/tecnologia.jpg',
                description: 'Dispositivos y gadgets',
                sortOrder: 2,
            },
            {
                title: 'Hogar',
                slug: 'hogar',
                image: 'https://example.com/categorias/hogar.jpg',
                description: 'Articulos para el hogar',
                sortOrder: 3,
            },
            {
                title: 'Gaming',
                slug: 'gaming',
                image: 'https://example.com/categorias/gaming.jpg',
                description: 'Consolas y accesorios',
                sortOrder: 4,
            },
        ],
        skipDuplicates: true,
    });

    console.log(` Categorías insertadas: ${result.count}`);
}