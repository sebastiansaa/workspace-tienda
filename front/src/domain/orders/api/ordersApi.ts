import { axiosAdapter } from '@/shared/api/axiosAdapter'
import type { AxiosResponse } from 'axios'
import type {
    CreateOrderFromItemsDTO,
    OrderResponseDTO,
} from '../interfaces/backend'

export const ordersApi = {
    list: (): Promise<AxiosResponse<OrderResponseDTO[]>> => axiosAdapter.get('/orders'),
    getById: (id: string): Promise<AxiosResponse<OrderResponseDTO>> => axiosAdapter.get(`/orders/${id}`),
    createFromCart: (): Promise<AxiosResponse<OrderResponseDTO>> => axiosAdapter.post('/orders/from-cart'),
    createFromItems: (body: CreateOrderFromItemsDTO): Promise<AxiosResponse<OrderResponseDTO>> =>
        axiosAdapter.post('/orders', body),
    cancel: (id: string): Promise<AxiosResponse<OrderResponseDTO>> =>
        axiosAdapter.patch(`/orders/${id}/cancel`),
    markPaid: (id: string): Promise<AxiosResponse<OrderResponseDTO>> =>
        axiosAdapter.patch(`/orders/${id}/pay`),
    complete: (id: string): Promise<AxiosResponse<OrderResponseDTO>> =>
        axiosAdapter.patch(`/orders/${id}/complete`),
}

export default ordersApi
