import type { OrderStatusDTO } from './backend'

export type OrderStatus = OrderStatusDTO

export interface OrderItem {
    productId: number
    quantity: number
    price: number
    lineTotal: number
}

export interface Order {
    id: string
    userId: string
    status: OrderStatus
    totalAmount: number
    items: OrderItem[]
    createdAt: string
    updatedAt: string
}
