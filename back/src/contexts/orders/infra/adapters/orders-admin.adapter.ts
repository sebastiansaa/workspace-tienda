import { Injectable } from '@nestjs/common';
import { OrdersAdminPort } from '../../../shared/ports/admin/orders-admin.port';
import {
    ListAllOrdersUsecase,
    AdminGetOrderByIdUsecase,
    AdminMarkOrderAsCompletedUsecase,
} from '../../app/usecases';
import OrderApiMapper from '../../api/mappers/order-api.mapper';
import { OrderResponseDto } from '../../api/dtos/response/order.response.dto';

@Injectable()
export class OrdersAdminAdapter implements OrdersAdminPort {
    constructor(
        private readonly listAllUsecase: ListAllOrdersUsecase,
        private readonly getByIdUsecase: AdminGetOrderByIdUsecase,
        private readonly completeUsecase: AdminMarkOrderAsCompletedUsecase,
    ) { }

    async listAll(): Promise<OrderResponseDto[]> {
        const orders = await this.listAllUsecase.execute();
        return orders.map((o) => OrderApiMapper.toResponse(o));
    }

    async getById(id: string): Promise<OrderResponseDto> {
        const order = await this.getByIdUsecase.execute(id);
        if (!order) throw new Error('Order not found');
        return OrderApiMapper.toResponse(order);
    }

    async complete(id: string): Promise<OrderResponseDto> {
        const order = await this.completeUsecase.execute(id);
        if (!order) throw new Error('Order not found');
        return OrderApiMapper.toResponse(order);
    }
}
