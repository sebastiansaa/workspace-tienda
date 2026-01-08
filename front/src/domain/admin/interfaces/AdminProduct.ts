export interface AdminProductDTO {
    id: number;
    title: string;
    price: number;
    stock?: number;
    active?: boolean;
    description?: string | null;
    images?: string[];
    categoryId?: number;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProductDto {
    title?: string;
    price?: number;
    stock?: number;
    active?: boolean;
    description?: string | null;
    images?: string[];
    categoryId?: number;
}
