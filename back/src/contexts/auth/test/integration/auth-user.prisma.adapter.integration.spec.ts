import { Test } from '@nestjs/testing';
import { AuthModule } from '../../auth.module';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AUTH_USER_REPOSITORY } from '../../constants';
import { cleanDatabase, ensureTestEnv } from '../../../../test-utils/prisma-test-helpers';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('AuthUserPrismaAdapter integration (Prisma)', () => {
    let moduleRef: any;
    let prisma: PrismaService;
    let repo: any;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [AuthModule],
        }).compile();

        await moduleRef.init();

        prisma = moduleRef.get(PrismaService);
        repo = moduleRef.get(AUTH_USER_REPOSITORY as any);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('save, findByEmail, findById work and persist correctly', async () => {
        const longHash = 'x'.repeat(60);

        const saved = await repo.save({
            id: 'u1',
            email: 't@t.com',
            passwordHash: longHash,
            roles: ['user'],
        });

        // Validación de shape del adapter
        expect(saved).toEqual(
            expect.objectContaining({
                id: 'u1',
                email: 't@t.com',
                passwordHash: longHash,
                roles: ['user'],
            }),
        );

        // Validación de persistencia real en DB
        const raw = await prisma.user.findUnique({ where: { id: 'u1' } });
        expect(raw).not.toBeNull();
        expect(raw?.email).toBe('t@t.com');

        // findByEmail
        const byEmail = await repo.findByEmail('t@t.com');
        expect(byEmail).toEqual(
            expect.objectContaining({
                id: 'u1',
                email: 't@t.com',
            }),
        );

        // findById
        const byId = await repo.findById('u1');
        expect(byId).toEqual(byEmail);
    });

    it('returns null when user does not exist', async () => {
        const byEmail = await repo.findByEmail('missing@test.com');
        const byId = await repo.findById('missing-id');

        expect(byEmail).toBeNull();
        expect(byId).toBeNull();
    });
});