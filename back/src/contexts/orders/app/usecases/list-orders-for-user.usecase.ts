import ListOrdersForUserQuery from '../queries/list-orders-for-user.query';
import { IOrderReadRepository } from '../ports/order-read.repository';
import { OrderEntity } from '../../domain/entity/order.entity';

export class ListOrdersForUserUsecase {
    constructor(private readonly orderReadRepo: IOrderReadRepository) { }

    async execute(query: ListOrdersForUserQuery): Promise<OrderEntity[]> {
        return this.orderReadRepo.listByUser(query.userId);
    }
}

export default ListOrdersForUserUsecase;
