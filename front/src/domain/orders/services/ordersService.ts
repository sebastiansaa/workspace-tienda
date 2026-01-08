import { logger } from '@/shared/services/logger'
import { ordersApi } from '../api/ordersApi'
import type { CreateOrderFromItemsDTO, OrderResponseDTO } from '../interfaces/backend'
import type { Order } from '../interfaces/types'

const mapOrder = (dto: OrderResponseDTO): Order => ({
    id: dto.id,
    userId: dto.userId,
    status: dto.status,
    totalAmount: dto.totalAmount,
    items: dto.items ?? [],
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
})

export const fetchOrders = async (): Promise<Order[]> => {
    const response = await ordersApi.list()
    return response.data.map(mapOrder)
}

export const fetchOrderById = async (id: string): Promise<Order> => {
    const response = await ordersApi.getById(id)
    return mapOrder(response.data)
}

export const createOrderFromCart = async (): Promise<Order> => {
    const response = await ordersApi.createFromCart()
    return mapOrder(response.data)
}

export const createOrderFromItems = async (body: CreateOrderFromItemsDTO): Promise<Order> => {
    const response = await ordersApi.createFromItems(body)
    return mapOrder(response.data)
}

export const cancelOrder = async (id: string): Promise<Order> => {
    const response = await ordersApi.cancel(id)
    return mapOrder(response.data)
}

export const markOrderPaid = async (id: string): Promise<Order> => {
    const response = await ordersApi.markPaid(id)
    return mapOrder(response.data)
}

export const completeOrder = async (id: string): Promise<Order> => {
    const response = await ordersApi.complete(id)
    return mapOrder(response.data)
}

export const safeMarkOrderPaid = async (id: string): Promise<Order | null> => {
    try {
        return await markOrderPaid(id)
    } catch (error) {
        logger.warn('[ordersService] markOrderPaid failed', error as Error)
        return null
    }
}

export default {
    fetchOrders,
    fetchOrderById,
    createOrderFromCart,
    createOrderFromItems,
    cancelOrder,
    markOrderPaid,
    completeOrder,
    safeMarkOrderPaid,
}
