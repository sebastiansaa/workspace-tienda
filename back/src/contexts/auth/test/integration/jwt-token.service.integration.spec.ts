import { Test } from '@nestjs/testing';
import { AuthModule } from '../../auth.module';
import { AUTH_TOKEN_SERVICE } from '../../constants';
import { cleanDatabase, ensureTestEnv } from '../../../../test-utils/prisma-test-helpers';
import { PrismaService } from '../../../../prisma/prisma.service';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('JwtTokenService integration', () => {
    let moduleRef: any;
    let svc: any;
    let prisma: PrismaService;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [AuthModule] }).compile();
        await moduleRef.init();
        svc = moduleRef.get(AUTH_TOKEN_SERVICE as any);
        prisma = moduleRef.get(PrismaService);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('signs and verifies tokens and hashes', async () => {
        const payload = { sub: 'u1', roles: ['user'] };
        const at = await svc.signAccessToken(payload);
        const rt = await svc.signRefreshToken(payload);

        const vp = await svc.verifyAccessToken(at);
        expect(vp.sub).toBe('u1');

        const hp = await svc.hashToken('x');
        const ok = await svc.compareTokenHash('x', hp);
        expect(ok).toBe(true);
    });
});
