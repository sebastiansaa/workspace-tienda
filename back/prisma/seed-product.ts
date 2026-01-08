import { PrismaClient } from '@prisma/client';

export async function seedProducts(prisma: PrismaClient) {
    const categories = await prisma.category.findMany({
        where: {
            title: { in: ['Ropa', 'Tecnologia', 'Hogar', 'Gaming'] },
        },
    });

    const categoryByTitle = new Map(categories.map((c) => [c.title, c.id]));

    const requiredTitles = ['Ropa', 'Tecnologia', 'Hogar', 'Gaming'];
    const missing = requiredTitles.filter((title) => !categoryByTitle.has(title));

    if (missing.length > 0) {
        throw new Error(
            `Faltan categorías requeridas antes de sembrar productos: ${missing.join(', ')}`
        );
    }

    const products = [
        // Ropa
        {
            title: 'Camiseta basica de algodon',
            slug: 'camiseta-basica-algodon',
            description: 'Camiseta de algodon peinado, corte regular, ideal para uso diario.',
            price: '19.99',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Ropa')!,
        },
        {
            title: 'Jeans slim azul oscuro',
            slug: 'jeans-slim-azul-oscuro',
            description: 'Jeans denim con elastano, tiro medio y lavado oscuro.',
            price: '49.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Ropa')!,
        },
        {
            title: 'Sudadera con capucha',
            slug: 'sudadera-capucha-relax',
            description: 'Sudadera de felpa con capucha y bolsillo canguro.',
            price: '39.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Ropa')!,
        },
        {
            title: 'Chaqueta impermeable ligera',
            slug: 'chaqueta-impermeable-ligera',
            description: 'Rompe vientos repelente al agua, ideal para lluvia ligera.',
            price: '69.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Ropa')!,
        },
        {
            title: 'Pack de calcetines deportivos (3 pares)',
            slug: 'pack-calcetines-deportivos-3',
            description: 'Calcetines transpirables con talon y puntera reforzados.',
            price: '9.99',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Ropa')!,
        },

        // Tecnología
        {
            title: 'Audifonos inalambricos con estuche',
            slug: 'audifonos-inalambricos-estuche',
            description: 'Bluetooth 5.3, cancelacion pasiva y autonomia de 24h con estuche.',
            price: '89.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Tecnologia')!,
        },
        {
            title: 'Teclado mecanico compacto',
            slug: 'teclado-mecanico-compacto',
            description: 'Formato 75%, switches tactiles, retroiluminacion blanca.',
            price: '99.00',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Tecnologia')!,
        },
        {
            title: 'Mouse inalambrico ergonomico',
            slug: 'mouse-inalambrico-ergonomico',
            description: 'Diseno para mano derecha, sensor optico 2400 DPI ajustable.',
            price: '29.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Tecnologia')!,
        },
        {
            title: 'Monitor 27 pulgadas IPS 2K',
            slug: 'monitor-27-ips-2k',
            description: 'Panel IPS 1440p, 75Hz, marcos delgados y ajuste de inclinacion.',
            price: '229.00',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Tecnologia')!,
        },
        {
            title: 'Smartwatch fitness con GPS',
            slug: 'smartwatch-fitness-gps',
            description: 'Monitoreo de ritmo cardiaco, GPS integrado y resistencia al agua 5ATM.',
            price: '129.00',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Tecnologia')!,
        },

        // Hogar
        {
            title: 'Juego de sabanas de microfibra',
            slug: 'juego-sabanas-microfibra',
            description: 'Juego de sabanas queen, tacto suave y facil planchado.',
            price: '39.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Hogar')!,
        },
        {
            title: 'Almohada memory foam',
            slug: 'almohada-memory-foam',
            description: 'Almohada viscoelastica con funda hipoalergenica removible.',
            price: '24.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Hogar')!,
        },
        {
            title: 'Lampara de escritorio LED',
            slug: 'lampara-escritorio-led',
            description: 'Lampara regulable con 3 temperaturas de color y puerto USB.',
            price: '34.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Hogar')!,
        },
        {
            title: 'Cafetera de goteo 12 tazas',
            slug: 'cafetera-goteo-12-tazas',
            description: 'Cafetera con jarra de vidrio, temporizador y apagado automatico.',
            price: '59.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Hogar')!,
        },
        {
            title: 'Sarten antiadherente 28cm',
            slug: 'sarten-antiadherente-28cm',
            description: 'Recubrimiento antiadherente libre de PFOA y mango ergonomico.',
            price: '27.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Hogar')!,
        },

        // Gaming
        {
            title: 'Silla gamer con soporte lumbar',
            slug: 'silla-gamer-soporte-lumbar',
            description: 'Silla reclinable con reposabrazos 3D y cojines lumbar/cervical.',
            price: '199.00',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Gaming')!,
        },
        {
            title: 'Auriculares gaming con microfono',
            slug: 'auriculares-gaming-microfono',
            description: 'Sonido stereo, microfono abatible y almohadillas de espuma.',
            price: '79.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Gaming')!,
        },
        {
            title: 'Control inalambrico pro',
            slug: 'control-inalambrico-pro',
            description: 'Mando inalambrico con modos PC/Console y bateria recargable.',
            price: '69.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Gaming')!,
        },
        {
            title: 'Alfombrilla gaming XL',
            slug: 'alfombrilla-gaming-xl',
            description: 'Mousepad extendido con base de goma y bordes cosidos.',
            price: '19.90',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Gaming')!,
        },
        {
            title: 'Microfono USB para streaming',
            slug: 'microfono-usb-streaming',
            description: 'Microfono cardioide con filtro antipop y base de escritorio.',
            price: '119.00',
            active: true,
            images: [],
            categoryId: categoryByTitle.get('Gaming')!,
        },
    ];

    const result = await prisma.product.createMany({
        data: products,
        skipDuplicates: true,
    });

    console.log(` Productos insertados: ${result.count}`);
}