import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
    @ApiProperty({ example: 'user-uuid', description: 'User identifier' })
    readonly id: string;

    @ApiProperty({ example: 'ada@example.com' })
    readonly email: string;

    @ApiProperty({ example: ['user'], description: 'Roles granted to the user' })
    readonly roles: string[];

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    readonly createdAt: string;

    @ApiProperty({ example: '2024-01-02T00:00:00.000Z' })
    readonly updatedAt: string;
}
