import { RefreshTokenEntity } from '../../domain/entity/refresh-token.entity';

export interface RefreshTokenRepositoryPort {
    save(token: RefreshTokenEntity): Promise<RefreshTokenEntity>;
    findByHash(hash: string): Promise<RefreshTokenEntity | null>;
    revokeByUserId(userId: string): Promise<void>;
}

export default RefreshTokenRepositoryPort;
