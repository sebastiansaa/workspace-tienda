import type { PaymentResponseDto } from '../../../payment/api/dtos/response/payment.response.dto';

export interface PaymentAdminPort {
    listAll(): Promise<PaymentResponseDto[]>;
    getById(id: string): Promise<PaymentResponseDto>;
}
