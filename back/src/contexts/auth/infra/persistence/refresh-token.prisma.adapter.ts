import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { RefreshTokenRepositoryPort } from '../../app/ports/refresh-token.repository.port';
import { RefreshTokenEntity } from '../../domain/entity/refresh-token.entity';
import AuthPrismaMapper from '../mappers/auth-prisma.mapper';

@Injectable()
export class RefreshTokenPrismaAdapter implements RefreshTokenRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async save(token: RefreshTokenEntity): Promise<RefreshTokenEntity> {
        const data = AuthPrismaMapper.toRefreshTokenPersistence(token);
        const saved = await this.prisma.refreshToken.create({ data });
        const entity = AuthPrismaMapper.toRefreshTokenEntity(saved);
        if (!entity) throw new Error('Failed to map refresh token');
        return entity;
    }

    async findByHash(hash: string): Promise<RefreshTokenEntity | null> {
        const found = await this.prisma.refreshToken.findUnique({ where: { tokenHash: hash } });
        return AuthPrismaMapper.toRefreshTokenEntity(found);
    }

    async revokeByUserId(userId: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }
}

export default RefreshTokenPrismaAdapter;
