export interface AdminCategoryDTO {
    id: number;
    title: string;
    slug: string;
    image?: string;
    description?: string;
    active: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface CreateCategoryDto {
    title: string;
    slug: string;
    image?: string;
    description?: string;
    active?: boolean;
    sortOrder?: number;
}

export interface UpdateCategoryDto {
    title?: string;
    slug?: string;
    image?: string;
    description?: string;
    active?: boolean;
    sortOrder?: number;
}
