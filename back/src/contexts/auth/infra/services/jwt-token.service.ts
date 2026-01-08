import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { createHash } from 'crypto';
import type * as ms from 'ms';
import { TokenPayload, TokenServicePort } from '../../app/ports/token.service.port';

@Injectable()
export class JwtTokenService implements TokenServicePort {
    private readonly secret: string;
    private readonly accessTtl: ms.StringValue;
    private readonly refreshTtl: ms.StringValue;
    private readonly refreshTtlMs: number;

    constructor(private readonly jwtService: JwtService, configService: ConfigService) {
        this.secret = configService.get<string>('AUTH_JWT_SECRET') ?? 'changeme';
        this.accessTtl = (configService.get<string>('AUTH_ACCESS_TOKEN_TTL') ?? '15m') as ms.StringValue;
        this.refreshTtl = (configService.get<string>('AUTH_REFRESH_TOKEN_TTL') ?? '7d') as ms.StringValue;
        this.refreshTtlMs = this.parseDurationMs(this.refreshTtl, 7 * 24 * 60 * 60 * 1000);
    }

    async signAccessToken(payload: TokenPayload): Promise<string> {
        const options: JwtSignOptions = {
            secret: this.secret,
            algorithm: 'HS256',
            expiresIn: this.accessTtl,
        };
        return this.jwtService.signAsync(payload, options);
    }

    async signRefreshToken(payload: TokenPayload): Promise<string> {
        const options: JwtSignOptions = {
            secret: this.secret,
            algorithm: 'HS256',
            expiresIn: this.refreshTtl,
        };
        return this.jwtService.signAsync(payload, options);
    }

    async verifyAccessToken(token: string): Promise<TokenPayload> {
        return this.jwtService.verifyAsync<TokenPayload>(token, {
            secret: this.secret,
            algorithms: ['HS256'],
        });
    }

    async verifyRefreshToken(token: string): Promise<TokenPayload> {
        return this.jwtService.verifyAsync<TokenPayload>(token, {
            secret: this.secret,
            algorithms: ['HS256'],
        });
    }

    async hashToken(token: string): Promise<string> {
        return createHash('sha256').update(token).digest('hex');
    }

    async compareTokenHash(token: string, hash: string): Promise<boolean> {
        const digest = await this.hashToken(token);
        return digest === hash;
    }

    getRefreshExpirationDate(): Date {
        return new Date(Date.now() + this.refreshTtlMs);
    }

    private parseDurationMs(value: ms.StringValue, fallback: number): number {
        const match = /^\s*(\d+)\s*([smhd])?\s*$/i.exec(value);
        if (!match) return fallback;
        const amount = parseInt(match[1], 10);
        const unit = (match[2] ?? 's').toLowerCase();
        const factor = unit === 'd' ? 86_400_000 : unit === 'h' ? 3_600_000 : unit === 'm' ? 60_000 : 1_000;
        return amount * factor;
    }
}

export default JwtTokenService;
