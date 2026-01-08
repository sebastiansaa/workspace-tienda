import { RegisterAuthDto, LoginAuthDto, RefreshTokenDto } from '../dtos/request';
import { AuthResponseDto, AuthTokensDto, AuthUserDto } from '../dtos/response';
import { RegisterUserInput, LoginUserInput, RefreshTokenInput } from '../../app/inputs';
import { GetAuthenticatedUserInput } from '../../app/inputs';
import { UserEntity } from '../../domain/entity/user.entity';
import { TokenPair } from '../../app/ports/token.service.port';

export class AuthApiMapper {
    static toRegisterInput(dto: RegisterAuthDto): RegisterUserInput {
        return new RegisterUserInput(dto.email, dto.password);
    }

    static toLoginInput(dto: LoginAuthDto): LoginUserInput {
        return new LoginUserInput(dto.email, dto.password);
    }

    static toRefreshInput(dto: RefreshTokenDto): RefreshTokenInput {
        return new RefreshTokenInput(dto.refreshToken);
    }

    static toGetAuthenticatedUserInput(userId: string): GetAuthenticatedUserInput {
        return new GetAuthenticatedUserInput(userId);
    }

    static toResponse(user: UserEntity, tokens: TokenPair): AuthResponseDto {
        return {
            user: this.toUserDto(user),
            tokens: this.toTokensDto(tokens),
        };
    }

    static toUserDto(user: UserEntity): AuthUserDto {
        return {
            id: user.id,
            email: user.email,
            roles: user.roles,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }

    static toTokensDto(tokens: TokenPair): AuthTokensDto {
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            tokenType: 'Bearer',
        };
    }
}
