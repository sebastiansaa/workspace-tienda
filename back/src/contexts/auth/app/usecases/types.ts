import { UserEntity } from '../../domain/entity/user.entity';
import { TokenPair } from '../ports/token.service.port';

export interface AuthResult {
    user: UserEntity;
    tokens: TokenPair;
}
