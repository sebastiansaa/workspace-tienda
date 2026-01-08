import { ApiProperty } from '@nestjs/swagger';

export class ResponseProductDto {
    @ApiProperty({ example: 1 })
    readonly id: number;

    @ApiProperty({ example: 'Camiseta básica' })
    readonly title: string;

    @ApiProperty({ example: 'camiseta-basica' })
    readonly slug: string;

    @ApiProperty({ example: 19.99 })
    readonly price: number;

    @ApiProperty({ example: 'Camiseta 100% algodón' })
    readonly description: string;

    @ApiProperty({ example: 120 })
    readonly stock: number;

    @ApiProperty({ example: true })
    readonly active: boolean;

    @ApiProperty({ example: ['https://cdn.example.com/p1.jpg'], type: [String] })
    readonly images: string[];

    @ApiProperty({ example: 3 })
    readonly categoryId: number;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'ISO string' })
    readonly createdAt: string; // ISO string

    @ApiProperty({ example: '2024-01-02T00:00:00.000Z', description: 'ISO string' })
    readonly updatedAt: string; // ISO string

    @ApiProperty({ example: '2024-02-01T00:00:00.000Z', required: false, description: 'ISO string or null if not deleted' })
    readonly deletedAt?: string | null;
}
