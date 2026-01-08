import { Test } from '@nestjs/testing';
import { AuthModule } from '../../auth.module';
import { AUTH_PASSWORD_HASHER } from '../../constants';
import { cleanDatabase, ensureTestEnv } from '../../../../test-utils/prisma-test-helpers';
import { PrismaService } from '../../../../prisma/prisma.service';

const suite = ensureTestEnv() ? describe : describe.skip;

suite('BcryptPasswordService integration', () => {
    let moduleRef: any;
    let svc: any;
    let prisma: PrismaService;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({ imports: [AuthModule] }).compile();
        await moduleRef.init();
        svc = moduleRef.get(AUTH_PASSWORD_HASHER as any);
        prisma = moduleRef.get(PrismaService);
    });

    beforeEach(async () => {
        await cleanDatabase(prisma);
    });

    afterAll(async () => {
        if (moduleRef) await moduleRef.close();
    });

    it('hashes and compares passwords', async () => {
        const h = await svc.hash('plain');
        expect(typeof h).toBe('string');
        const ok = await svc.compare('plain', h);
        expect(ok).toBe(true);
    });
});
