export interface CategoryProps {
    id?: number;
    title: string;
    slug: string;
    image: string;
    description?: string;
    active?: boolean;
    sortOrder?: number;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
