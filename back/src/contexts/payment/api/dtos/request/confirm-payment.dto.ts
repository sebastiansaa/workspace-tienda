import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ConfirmPaymentDto {
    @ApiPropertyOptional({ example: 'pm_tok_123', description: 'Token del método de pago si aplica' })
    @IsOptional()
    @IsString()
    paymentMethodToken?: string;
}
