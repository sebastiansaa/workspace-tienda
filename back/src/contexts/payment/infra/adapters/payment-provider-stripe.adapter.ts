import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import PaymentProviderPort, { PaymentProviderResult, PaymentProviderConfirmInput, PaymentProviderFailInput, PaymentProviderInitInput } from '../../app/ports/payment-provider.port';
import { PaymentStatus } from '../../domain/v-o/payment-status.vo';

const generateExternalId = (): string => `pi_stripe_${randomUUID().replace(/-/g, '').slice(0, 24)}`;
const generateClientSecret = (): string => `cs_stripe_${randomUUID().replace(/-/g, '').slice(0, 24)}`;

@Injectable()
export class PaymentProviderStripeAdapter implements PaymentProviderPort {
    // Deterministic, lightweight Stripe-like adapter for integration tests.
    async initiatePayment(_input: PaymentProviderInitInput): Promise<PaymentProviderResult> {
        const ext = generateExternalId();
        const clientSecret = generateClientSecret();
        const status: PaymentStatus = 'PENDING';
        return this.buildResult(status, ext, clientSecret);
    }

    async confirmPayment(input: PaymentProviderConfirmInput): Promise<PaymentProviderResult> {
        const ext = input.externalPaymentId ?? generateExternalId();
        const clientSecret = generateClientSecret();
        const status: PaymentStatus = 'PAID';
        return this.buildResult(status, ext, clientSecret);
    }

    async failPayment(input: PaymentProviderFailInput): Promise<PaymentProviderResult> {
        const ext = input.externalPaymentId ?? generateExternalId();
        const clientSecret = generateClientSecret();
        return this.buildResult('FAILED', ext, clientSecret);
    }

    private buildResult(status: PaymentStatus, externalId: string, clientSecret: string): PaymentProviderResult {
        return {
            externalPaymentId: externalId,
            status,
            clientSecret,
            payload: {
                id: externalId,
                status,
                client_secret: clientSecret,
                created: new Date().toISOString(),
            },
        };
    }
}

export default PaymentProviderStripeAdapter;
