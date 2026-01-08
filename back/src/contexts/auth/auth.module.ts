import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthController } from './api/controller/auth.controller';
import { RegisterUserUseCase, LoginUserUseCase, RefreshTokenUseCase, RevokeRefreshTokenUseCase, GetAuthenticatedUserUseCase } from './app/usecases';
import { UserRepositoryPort } from './app/ports/auth-user.repository.port';
import { RefreshTokenRepositoryPort } from './app/ports/refresh-token.repository.port';
import { TokenServicePort } from './app/ports/token.service.port';
import { PasswordHasherPort } from './app/ports/password-hasher.port';
import { AUTH_PASSWORD_HASHER, AUTH_REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_SERVICE, AUTH_USER_REPOSITORY } from './constants';
import { AuthUserPrismaAdapter } from './infra/persistence/auth-user.prisma.adapter';
import { RefreshTokenPrismaAdapter } from './infra/persistence/refresh-token.prisma.adapter';
import { JwtTokenService } from './infra/services/jwt-token.service';
import { BcryptPasswordService } from './infra/services/bcrypt-password.service';
import { JwtStrategy } from './infra/strategies/jwt.strategy';
import { RefreshJwtStrategy } from './infra/strategies/refresh-jwt.strategy';
import { JwtAuthGuard } from './infra/guards/jwt-auth.guard';
import { RolesGuard } from './infra/guards/roles.guard';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('AUTH_JWT_SECRET') ?? 'changeme',
                signOptions: { algorithm: 'HS256' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        PrismaService,
        { provide: AUTH_USER_REPOSITORY, useClass: AuthUserPrismaAdapter },
        { provide: AUTH_REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenPrismaAdapter },
        { provide: AUTH_TOKEN_SERVICE, useClass: JwtTokenService },
        { provide: AUTH_PASSWORD_HASHER, useClass: BcryptPasswordService },
        JwtStrategy,
        RefreshJwtStrategy,
        JwtAuthGuard,
        RolesGuard,
        {
            provide: RegisterUserUseCase,
            useFactory: (
                userRepo: UserRepositoryPort,
                refreshRepo: RefreshTokenRepositoryPort,
                tokenService: TokenServicePort,
                passwordHasher: PasswordHasherPort,
            ) => new RegisterUserUseCase(userRepo, refreshRepo, tokenService, passwordHasher),
            inject: [AUTH_USER_REPOSITORY, AUTH_REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_SERVICE, AUTH_PASSWORD_HASHER],
        },
        {
            provide: LoginUserUseCase,
            useFactory: (
                userRepo: UserRepositoryPort,
                refreshRepo: RefreshTokenRepositoryPort,
                tokenService: TokenServicePort,
                passwordHasher: PasswordHasherPort,
            ) => new LoginUserUseCase(userRepo, refreshRepo, tokenService, passwordHasher),
            inject: [AUTH_USER_REPOSITORY, AUTH_REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_SERVICE, AUTH_PASSWORD_HASHER],
        },
        {
            provide: RefreshTokenUseCase,
            useFactory: (
                userRepo: UserRepositoryPort,
                refreshRepo: RefreshTokenRepositoryPort,
                tokenService: TokenServicePort,
            ) => new RefreshTokenUseCase(userRepo, refreshRepo, tokenService),
            inject: [AUTH_USER_REPOSITORY, AUTH_REFRESH_TOKEN_REPOSITORY, AUTH_TOKEN_SERVICE],
        },
        {
            provide: RevokeRefreshTokenUseCase,
            useFactory: (refreshRepo: RefreshTokenRepositoryPort) => new RevokeRefreshTokenUseCase(refreshRepo),
            inject: [AUTH_REFRESH_TOKEN_REPOSITORY],
        },
        {
            provide: GetAuthenticatedUserUseCase,
            useFactory: (userRepo: UserRepositoryPort) => new GetAuthenticatedUserUseCase(userRepo),
            inject: [AUTH_USER_REPOSITORY],
        },
    ],
    exports: [JwtAuthGuard, RolesGuard, AUTH_USER_REPOSITORY, AUTH_TOKEN_SERVICE],
})
export class AuthModule { }
