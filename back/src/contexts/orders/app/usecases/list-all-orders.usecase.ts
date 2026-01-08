import { IOrderReadRepository } from '../ports/order-read.repository';
import { OrderEntity } from '../../domain/entity/order.entity';

export class ListAllOrdersUsecase {
    constructor(private readonly orderReadRepo: IOrderReadRepository) { }

    async execute(): Promise<OrderEntity[]> {
        if (typeof this.orderReadRepo.listAll !== 'function') {
            throw new Error('Order read repository does not implement listAll');
        }

        return this.orderReadRepo.listAll();
    }
}

export default ListAllOrdersUsecase;
