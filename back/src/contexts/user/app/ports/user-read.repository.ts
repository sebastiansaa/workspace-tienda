import { UserEntity } from '../../domain/entity/user.entity';

export interface IUserReadRepository {
    findById(id: string): Promise<UserEntity | null>;
    findByIdWithAddresses(id: string): Promise<UserEntity | null>;
    listAll(): Promise<UserEntity[]>;
}
