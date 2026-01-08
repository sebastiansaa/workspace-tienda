import MarkOrderAsCompletedCommand from '../commands/mark-order-completed.command';
import { IOrderReadRepository } from '../ports/order-read.repository';
import { IOrderWriteRepository } from '../ports/order-write.repository';
import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderOwnershipError } from '../../domain/errors/order.errors';

export class MarkOrderAsCompletedUsecase {
    constructor(
        private readonly orderReadRepo: IOrderReadRepository,
        private readonly orderWriteRepo: IOrderWriteRepository,
    ) { }

    async execute(cmd: MarkOrderAsCompletedCommand): Promise<OrderEntity | null> {
        const order = await this.orderReadRepo.findById(cmd.orderId);
        if (!order) return null;
        if (order.userId !== cmd.userId) throw new OrderOwnershipError();

        order.markCompleted();
        return this.orderWriteRepo.save(order);
    }
}

export default MarkOrderAsCompletedUsecase;
