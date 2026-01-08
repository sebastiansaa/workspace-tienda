import GetOrderByIdQuery from '../queries/get-order-by-id.query';
import { IOrderReadRepository } from '../ports/order-read.repository';
import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderOwnershipError } from '../../domain/errors/order.errors';

export class GetOrderByIdUsecase {
    constructor(private readonly orderReadRepo: IOrderReadRepository) { }

    async execute(query: GetOrderByIdQuery): Promise<OrderEntity | null> {
        const order = await this.orderReadRepo.findById(query.orderId);
        if (!order) return null;
        if (order.userId !== query.userId) throw new OrderOwnershipError();
        return order;
    }
}

export default GetOrderByIdUsecase;
