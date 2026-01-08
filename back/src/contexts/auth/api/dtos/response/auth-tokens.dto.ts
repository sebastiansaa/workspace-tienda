import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
    readonly accessToken: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh...', description: 'Long-lived refresh token' })
    readonly refreshToken: string;

    @ApiProperty({ example: 'Bearer', description: 'Token type prefix for Authorization header' })
    readonly tokenType: 'Bearer';
}
