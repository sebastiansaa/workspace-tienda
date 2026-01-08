import { LoginUserInput } from '../inputs';
import { UserRepositoryPort } from '../ports/auth-user.repository.port';
import { RefreshTokenRepositoryPort } from '../ports/refresh-token.repository.port';
import { TokenServicePort } from '../ports/token.service.port';
import { PasswordHasherPort } from '../ports/password-hasher.port';
import { RefreshTokenEntity } from '../../domain/entity/refresh-token.entity';
import { AuthResult } from './types';
import { InvalidCredentialsError } from '../../domain/errors/auth.errors';

/**
 * Caso de uso para gestionar el inicio de sesión.
 * Valida credenciales, genera el par de tokens (Access/Refresh) y persiste la rotación de tokens.
 */
export class LoginUserUseCase {
    constructor(
        private readonly userRepo: UserRepositoryPort,
        private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
        private readonly tokenService: TokenServicePort,
        private readonly passwordHasher: PasswordHasherPort,
    ) { }

    async execute(input: LoginUserInput): Promise<AuthResult> {
        // 1. Verificación de existencia del usuario
        const user = await this.userRepo.findByEmail(input.email);
        if (!user) {
            throw new InvalidCredentialsError();
        }

        // 2. Validación de contraseña mediante hash seguro
        const valid = await this.passwordHasher.compare(input.password, user.passwordHash);
        if (!valid) {
            throw new InvalidCredentialsError();
        }

        // 3. Generación de identidad mediante JWT
        const tokens = await this.generateTokens(user);

        // 4. Persistencia del Refresh Token para control de sesiones y revocación
        await this.persistRefreshToken(user.id, tokens.refreshToken);

        return { user, tokens };
    }

    /**
     * Crea los tokens firmados con el payload del usuario (ID y Roles).
     */
    private async generateTokens(user: { id: string; roles: string[] }) {
        const payload = { sub: user.id, roles: user.roles };
        const accessToken = await this.tokenService.signAccessToken(payload);
        const refreshToken = await this.tokenService.signRefreshToken(payload);
        return { accessToken, refreshToken };
    }

    /**
     * Registra el Refresh Token en la base de datos tras revocar los anteriores (Single Session).
     * El hash del token se almacena por seguridad en lugar del token en texto plano.
     */
    private async persistRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.refreshTokenRepo.revokeByUserId(userId);
        const tokenHash = await this.tokenService.hashToken(refreshToken);
        const expiresAt = this.tokenService.getRefreshExpirationDate();
        const token = RefreshTokenEntity.create({ userId, tokenHash, expiresAt });
        await this.refreshTokenRepo.save(token);
    }
}
