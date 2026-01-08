import { Test } from '@nestjs/testing';
import { AuthModule } from '../../auth.module';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AUTH_REFRESH_TOKEN_REPOSITORY } from '../../constants';
import { RefreshTokenEntity } from '../../domain/entity/refresh-token.entity';
import { cleanDatabase, ensureTestEnv } from '../../../../test-utils/prisma-test-helpers';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('RefreshTokenPrismaAdapter integration (Prisma)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let repo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [AuthModule] }).compile();
        await moduleRef.init();
        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(AUTH_REFRESH_TOKEN_REPOSITORY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('save, findByHash and revokeByUserId', async () => {
        // ensure a user exists for the foreign key
        const longHash = 'x'.repeat(60);
        await prisma.user.create({ data: { id: 'u1', email: 'user@t.test', passwordHash: longHash, roles: ['user'] } });

        const tokenEntity = RefreshTokenEntity.create({ userId: 'u1', tokenHash: 'h', expiresAt: new Date(Date.now() + 1000 * 60) });
        const token = await repo.save(tokenEntity);
        expect(token).toBeDefined();

        const found = await repo.findByHash('h');
        expect(found).toBeDefined();

        await repo.revokeByUserId('u1');
        const after = await repo.findByHash('h');
        expect(after).toBeNull();
    });
});
