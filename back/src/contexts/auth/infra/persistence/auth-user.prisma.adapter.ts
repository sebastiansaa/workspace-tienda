import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserRepositoryPort } from '../../app/ports/auth-user.repository.port';
import { UserEntity } from '../../domain/entity/user.entity';
import AuthPrismaMapper from '../mappers/auth-prisma.mapper';

@Injectable()
export class AuthUserPrismaAdapter implements UserRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const row = await this.prisma.user.findUnique({ where: { email } });
        return AuthPrismaMapper.toUserEntity(row);
    }

    async findById(id: string): Promise<UserEntity | null> {
        const row = await this.prisma.user.findUnique({ where: { id } });
        return AuthPrismaMapper.toUserEntity(row);
    }

    async save(user: UserEntity): Promise<UserEntity> {
        const data = AuthPrismaMapper.toUserPersistence(user);
        const saved = await this.prisma.user.upsert({ where: { id: user.id }, update: data, create: data });
        const entity = AuthPrismaMapper.toUserEntity(saved);
        if (!entity) throw new Error('Failed to map user');
        return entity;
    }
}

export default AuthUserPrismaAdapter;
