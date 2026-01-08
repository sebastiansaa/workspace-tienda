import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddressDto {
    @ApiProperty({ example: '123 Main St' })
    @IsString()
    street: string;

    @ApiProperty({ example: 'Madrid' })
    @IsString()
    city: string;

    @ApiProperty({ example: 'Spain' })
    @IsString()
    country: string;

    @ApiProperty({ example: '28001' })
    @IsString()
    zipCode: string;
}
