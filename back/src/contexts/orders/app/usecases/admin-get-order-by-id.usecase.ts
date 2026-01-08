import { IOrderReadRepository } from '../ports/order-read.repository';
import { OrderEntity } from '../../domain/entity/order.entity';

export class AdminGetOrderByIdUsecase {
    constructor(private readonly orderReadRepo: IOrderReadRepository) { }

    async execute(orderId: string): Promise<OrderEntity | null> {
        return this.orderReadRepo.findById(orderId);
    }
}

export default AdminGetOrderByIdUsecase;
