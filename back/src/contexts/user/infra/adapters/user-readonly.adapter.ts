import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import UserReadOnlyPort from '../../app/ports/user-readonly.port';

@Injectable()
export class UserReadOnlyAdapter implements UserReadOnlyPort {
    constructor(private readonly prisma: PrismaService) { }

    async findProfileById(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) return null;
        return {
            id: user.id,
            email: user.email,
            name: user.name ?? '',
            phone: user.phone ?? null,
            status: user.status,
        };
    }
}

export default UserReadOnlyAdapter;
