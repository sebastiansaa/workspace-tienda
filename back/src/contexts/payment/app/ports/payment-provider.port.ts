import { PaymentStatus } from '../../domain/v-o/payment-status.vo';

export interface PaymentProviderInitInput {
    paymentId: string;
    orderId: string;
    amount: number;
    currency?: string;
    paymentMethodToken?: string;
}

export interface PaymentProviderConfirmInput {
    externalPaymentId: string;
    paymentMethodToken?: string;
}

export interface PaymentProviderFailInput {
    externalPaymentId: string;
}

export interface PaymentProviderResult {
    externalPaymentId: string;
    status: PaymentStatus;
    clientSecret?: string;
    payload: Record<string, unknown>;
}

export interface PaymentProviderPort {
    initiatePayment(input: PaymentProviderInitInput): Promise<PaymentProviderResult>;
    confirmPayment(input: PaymentProviderConfirmInput): Promise<PaymentProviderResult>;
    failPayment(input: PaymentProviderFailInput): Promise<PaymentProviderResult>;
}

export default PaymentProviderPort;
