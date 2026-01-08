import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
    @ApiProperty({ example: 'payment-uuid' })
    paymentId: string;

    @ApiProperty({ example: 'order-uuid-123' })
    orderId: string;

    @ApiProperty({ example: 120.5 })
    amount: number;

    @ApiProperty({ enum: ['PENDING', 'AUTHORIZED', 'PAID', 'FAILED'] })
    status: string;

    @ApiProperty({ example: 'pi_fake_1234567890' })
    externalPaymentId?: string;

    @ApiProperty({ example: 'cs_test_1234567890' })
    clientSecret?: string;

    @ApiProperty({ example: 'FAKE' })
    provider: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    createdAt: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updatedAt: string;
}
