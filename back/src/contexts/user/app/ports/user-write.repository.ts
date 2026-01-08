import { UserEntity } from '../../domain/entity/user.entity';
import { AddressEntity } from '../../domain/entity/address.entity';
import { UserStatus } from '../../domain/v-o/user-status.vo';

export interface IUserWriteRepository {
    save(user: UserEntity): Promise<UserEntity>;
    addAddress(userId: string, address: AddressEntity): Promise<AddressEntity>;
    updateAddress(userId: string, address: AddressEntity): Promise<AddressEntity>;
    deleteAddress(userId: string, addressId: string): Promise<void>;
    changeStatus(userId: string, status: UserStatus): Promise<UserEntity>;
}
