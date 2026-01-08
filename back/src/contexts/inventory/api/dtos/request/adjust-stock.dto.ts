import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class AdjustStockDto {
    @ApiProperty({ example: 5, description: 'Units to adjust (positive to add, negative not allowed here)' })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    quantity: number;

    @ApiProperty({ example: 'MANUAL_ADJUSTMENT', description: 'Reason for the stock change' })
    @IsString()
    @MinLength(1)
    reason: string;
}
