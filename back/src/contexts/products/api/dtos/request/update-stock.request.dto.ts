import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateStockRequestDto {
    @ApiProperty({ example: 25, description: 'New on-hand stock value' })
    @IsInt()
    @Min(0)
    readonly quantity: number;
}
