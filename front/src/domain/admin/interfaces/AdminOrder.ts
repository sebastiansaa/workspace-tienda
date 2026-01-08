export interface AdminOrderItemDTO {
    productId: number;
    quantity: number;
    price: number;
    lineTotal: number;
}

export interface AdminOrderDTO {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    items?: AdminOrderItemDTO[];
    createdAt: string;
    updatedAt: string;
}

export interface AdminListQuery {
    page?: number;
    limit?: number;
    sort?: string;
    filter?: string;
    q?: string;
}
