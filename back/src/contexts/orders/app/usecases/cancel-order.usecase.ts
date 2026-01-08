import CancelOrderCommand from '../commands/cancel-order.command';
import { IOrderReadRepository } from '../ports/order-read.repository';
import { IOrderWriteRepository } from '../ports/order-write.repository';
import { OrderEntity } from '../../domain/entity/order.entity';
import { OrderOwnershipError } from '../../domain/errors/order.errors';

export class CancelOrderUsecase {
    constructor(
        private readonly orderReadRepo: IOrderReadRepository,
        private readonly orderWriteRepo: IOrderWriteRepository,
    ) { }

    async execute(cmd: CancelOrderCommand): Promise<OrderEntity | null> {
        const order = await this.orderReadRepo.findById(cmd.orderId);
        if (!order) return null;
        if (order.userId !== cmd.userId) throw new OrderOwnershipError();

        order.cancel();
        return this.orderWriteRepo.save(order);
    }
}

export default CancelOrderUsecase;
