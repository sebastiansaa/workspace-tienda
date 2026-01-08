import { ApiProperty } from '@nestjs/swagger';
import { AuthUserDto } from './auth-user.dto';
import { AuthTokensDto } from './auth-tokens.dto';

export class AuthResponseDto {
    @ApiProperty({ type: AuthUserDto })
    readonly user: AuthUserDto;

    @ApiProperty({ type: AuthTokensDto })
    readonly tokens: AuthTokensDto;
}
