import { z } from 'zod';

export function validateEnv(config: Record<string, unknown>) {
    const schema = z.object({
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
        PORT: z.coerce.number().int().positive().default(3000),
        DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
        AUTH_JWT_SECRET: z.string().min(16, 'AUTH_JWT_SECRET must be at least 16 chars'),
        AUTH_ACCESS_TOKEN_TTL: z.string().default('15m'),
        AUTH_REFRESH_TOKEN_TTL: z.string().default('7d'),
        CORS_ORIGINS: z.string().optional(),
    });

    const parsed = schema.safeParse(config);
    if (!parsed.success) {
        const messages = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        throw new Error(`Invalid environment configuration: ${messages}`);
    }

    return parsed.data;
}

export default validateEnv;
