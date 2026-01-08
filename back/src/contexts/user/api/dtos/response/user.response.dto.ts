import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto {
    @ApiProperty({ example: 'address-uuid' })
    id: string;

    @ApiProperty({ example: '123 Main St' })
    street: string;

    @ApiProperty({ example: 'Madrid' })
    city: string;

    @ApiProperty({ example: 'Spain' })
    country: string;

    @ApiProperty({ example: '28001' })
    zipCode: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updatedAt: string;
}

export class UserResponseDto {
    @ApiProperty({ example: 'user-uuid' })
    id: string;

    @ApiProperty({ example: 'ada@example.com' })
    email: string;

    @ApiProperty({ example: 'Ada Lovelace' })
    name: string;

    @ApiProperty({ example: '+34123456789', nullable: true })
    phone: string | null;

    @ApiProperty({ enum: ['ACTIVE', 'SUSPENDED', 'DELETED'] })
    status: string;

    @ApiProperty({ example: { theme: 'dark' }, nullable: true })
    preferences: Record<string, unknown> | null;

    @ApiProperty({ type: [AddressResponseDto] })
    addresses: AddressResponseDto[];

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updatedAt: string;
}
