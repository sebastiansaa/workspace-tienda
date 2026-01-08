import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import PaymentProviderPort, { PaymentProviderResult, PaymentProviderConfirmInput, PaymentProviderFailInput, PaymentProviderInitInput } from '../../app/ports/payment-provider.port';
import { PaymentStatus } from '../../domain/v-o/payment-status.vo';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const randomFail = (probability: number): boolean => Math.random() < probability;

const generateExternalId = (): string => `pi_fake_${randomUUID().replace(/-/g, '').slice(0, 24)}`;
const generateClientSecret = (): string => `cs_test_${randomUUID().replace(/-/g, '').slice(0, 24)}`;

@Injectable()
export class PaymentProviderFakeAdapter implements PaymentProviderPort {
    async initiatePayment(_input: PaymentProviderInitInput): Promise<PaymentProviderResult> {
        await delay(150 + Math.random() * 250);
        if (randomFail(0.1)) {
            return this.buildResult('FAILED');
        }
        const status: PaymentStatus = randomFail(0.2) ? 'AUTHORIZED' : 'PENDING';
        return this.buildResult(status);
    }

    async confirmPayment(input: PaymentProviderConfirmInput): Promise<PaymentProviderResult> {
        await delay(100 + Math.random() * 200);
        if (randomFail(0.15)) {
            return this.buildResult('FAILED', input.externalPaymentId);
        }
        const status: PaymentStatus = randomFail(0.4) ? 'AUTHORIZED' : 'PAID';
        return this.buildResult(status, input.externalPaymentId);
    }

    async failPayment(input: PaymentProviderFailInput): Promise<PaymentProviderResult> {
        await delay(80 + Math.random() * 150);
        return this.buildResult('FAILED', input.externalPaymentId);
    }

    private buildResult(status: PaymentStatus, externalId?: string): PaymentProviderResult {
        const extId = externalId ?? generateExternalId();
        const clientSecret = generateClientSecret();
        return {
            externalPaymentId: extId,
            status,
            clientSecret,
            payload: {
                id: extId,
                status,
                client_secret: clientSecret,
                created: new Date().toISOString(),
            },
        };
    }
}

export default PaymentProviderFakeAdapter;
