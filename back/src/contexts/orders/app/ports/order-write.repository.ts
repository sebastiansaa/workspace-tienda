import { OrderEntity } from '../../domain/entity/order.entity';

export interface IOrderWriteRepository {
    save(order: OrderEntity): Promise<OrderEntity>;
}

export default IOrderWriteRepository;
