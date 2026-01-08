import { UserEntity } from '../../domain/entity/user.entity';

export interface UserRepositoryPort {
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    save(user: UserEntity): Promise<UserEntity>;
}

export default UserRepositoryPort;
