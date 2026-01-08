export interface ProductProps {
    id?: number;
    title: string;
    slug: string;
    price: number;        // se cambia a Decimal en mapper
    description: string;
    stock: number;
    active: boolean;
    deletedAt?: Date | null;
    images: string[];
    categoryId: number;
    createdAt?: Date;
    updatedAt?: Date;
}