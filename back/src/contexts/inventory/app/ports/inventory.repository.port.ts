import { IInventoryReadRepository } from './inventory-read.repository';
import { IInventoryWriteRepository } from './inventory-write.repository';

export type InventoryRepositoryPort = IInventoryReadRepository & IInventoryWriteRepository;

export default InventoryRepositoryPort;
