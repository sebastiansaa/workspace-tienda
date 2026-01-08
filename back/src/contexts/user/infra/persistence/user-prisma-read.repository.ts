import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IUserReadRepository } from '../../app/ports/user-read.repository';
import { UserEntity } from '../../domain/entity/user.entity';
import { UserMapper } from '../mappers/user-prisma.mapper';

@Injectable()
export class UserPrismaReadRepository implements IUserReadRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<UserEntity | null> {
        const result = await this.prisma.user.findUnique({ where: { id } });
        return result ? UserMapper.toDomain(result) : null;
    }

    async findByIdWithAddresses(id: string): Promise<UserEntity | null> {
        const result = await this.prisma.user.findUnique({
            where: { id },
            include: { addresses: true }
        });
        return result ? UserMapper.toDomain(result) : null;
    }

    async listAll(): Promise<UserEntity[]> {
        const result = await this.prisma.user.findMany({
            include: { addresses: true } // Better to include them if we want a full list
        });
        return result.map((u) => UserMapper.toDomain(u));
    }
}
