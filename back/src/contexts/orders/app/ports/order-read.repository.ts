import { OrderEntity } from '../../domain/entity/order.entity';

export interface IOrderReadRepository {
    findById(id: string): Promise<OrderEntity | null>;
    listByUser(userId: string): Promise<OrderEntity[]>;
    listAll(): Promise<OrderEntity[]>;
}

export default IOrderReadRepository;
