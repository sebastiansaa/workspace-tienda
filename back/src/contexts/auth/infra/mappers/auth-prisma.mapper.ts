import { Prisma } from '@prisma/client';
import { UserEntity } from '../../domain/entity/user.entity';
import { RefreshTokenEntity } from '../../domain/entity/refresh-token.entity';

export class AuthPrismaMapper {
    static toUserEntity(row: Prisma.UserGetPayload<true> | null | undefined): UserEntity | null {
        if (!row) return null;
        return UserEntity.rehydrate({
            id: row.id,
            email: row.email,
            passwordHash: row.passwordHash,
            roles: row.roles ?? [],
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }

    static toUserPersistence(entity: UserEntity): Prisma.UserUncheckedCreateInput {
        return {
            id: entity.id,
            email: entity.email,
            passwordHash: entity.passwordHash,
            roles: entity.roles,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toRefreshTokenEntity(row: Prisma.RefreshTokenGetPayload<true> | null | undefined): RefreshTokenEntity | null {
        if (!row) return null;
        return RefreshTokenEntity.rehydrate({
            id: row.id,
            userId: row.userId,
            tokenHash: row.tokenHash,
            expiresAt: row.expiresAt,
            createdAt: row.createdAt,
        });
    }

    static toRefreshTokenPersistence(entity: RefreshTokenEntity): Prisma.RefreshTokenUncheckedCreateInput {
        return {
            id: entity.id,
            userId: entity.userId,
            tokenHash: entity.tokenHash,
            expiresAt: entity.expiresAt,
            createdAt: entity.createdAt,
        };
    }
}

export default AuthPrismaMapper;
