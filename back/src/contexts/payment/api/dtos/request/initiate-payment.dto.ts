import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';

export class InitiatePaymentItemDto {
    @ApiProperty({ example: 42 })
    @IsNumber()
    @IsPositive()
    productId!: number;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsPositive()
    quantity!: number;

    @ApiProperty({ example: 59.99 })
    @IsNumber()
    @IsPositive()
    price!: number;
}

export class InitiatePaymentDto {
    @ApiPropertyOptional({ example: 'order-uuid-123', description: 'Si no se envía, se genera una orden PENDING automáticamente' })
    @IsOptional()
    @IsString()
    orderId?: string;

    @ApiProperty({ example: 120.5 })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiPropertyOptional({ example: 'eur' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional({ example: 'pm_tok_123', description: 'Token de método de pago (card token)' })
    @IsOptional()
    @IsString()
    paymentMethodToken?: string;

    @ApiPropertyOptional({ description: 'Snapshot de items usados para crear la orden si no existe', type: () => [InitiatePaymentItemDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InitiatePaymentItemDto)
    items?: InitiatePaymentItemDto[];
}
