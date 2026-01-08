import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../app/ports/token.service.port';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('AUTH_JWT_SECRET') ?? 'changeme',
            algorithms: ['HS256'],
        });
    }

    async validate(payload: TokenPayload) {
        return { sub: payload.sub, roles: payload.roles ?? [] };
    }
}

export default JwtStrategy;
