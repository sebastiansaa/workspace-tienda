import { IOrderReadRepository } from '../ports/order-read.repository';
import { IOrderWriteRepository } from '../ports/order-write.repository';
import { OrderEntity } from '../../domain/entity/order.entity';

export class AdminMarkOrderAsCompletedUsecase {
    constructor(
        private readonly orderReadRepo: IOrderReadRepository,
        private readonly orderWriteRepo: IOrderWriteRepository,
    ) { }

    async execute(orderId: string): Promise<OrderEntity | null> {
        const order = await this.orderReadRepo.findById(orderId);
        if (!order) return null;

        order.markCompleted();
        return this.orderWriteRepo.save(order);
    }
}

export default AdminMarkOrderAsCompletedUsecase;
