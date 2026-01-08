import { Injectable } from '@nestjs/common';
import { PaymentAdminPort } from '../../../shared/ports/admin/payment-admin.port';
import {
    ListAllPaymentsUsecase,
    AdminGetPaymentByIdUsecase,
} from '../../app/usecases';
import PaymentApiMapper from '../../api/mappers/payment-api.mapper';
import { PaymentResponseDto } from '../../api/dtos/response/payment.response.dto';

@Injectable()
export class PaymentAdminAdapter implements PaymentAdminPort {
    constructor(
        private readonly listAllUsecase: ListAllPaymentsUsecase,
        private readonly getByIdUsecase: AdminGetPaymentByIdUsecase,
    ) { }

    async listAll(): Promise<PaymentResponseDto[]> {
        const payments = await this.listAllUsecase.execute();
        return PaymentApiMapper.toResponseList(payments);
    }

    async getById(id: string): Promise<PaymentResponseDto> {
        const payment = await this.getByIdUsecase.execute(id);
        if (!payment) throw new Error('Payment not found');
        return PaymentApiMapper.toResponseDto(payment);
    }
}
