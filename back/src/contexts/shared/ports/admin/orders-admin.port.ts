import type { OrderResponseDto } from '../../../orders/api/dtos/response/order.response.dto';

export interface OrdersAdminPort {
    listAll(): Promise<OrderResponseDto[]>;
    getById(id: string): Promise<OrderResponseDto>;
    complete(id: string): Promise<OrderResponseDto>;
}
