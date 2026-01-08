export type OrderStatusDTO = 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED'

export interface OrderItemResponseDTO {
    productId: number
    quantity: number
    price: number
    lineTotal: number
}

export interface OrderResponseDTO {
    id: string
    userId: string
    status: OrderStatusDTO
    totalAmount: number
    items: OrderItemResponseDTO[]
    createdAt: string
    updatedAt: string
}

export interface OrderItemRequestDTO {
    productId: number
    quantity: number
}

export interface CreateOrderFromItemsDTO {
    items: OrderItemRequestDTO[]
}
