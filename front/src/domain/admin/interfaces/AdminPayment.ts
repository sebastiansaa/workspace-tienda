export type AdminPaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';
export type AdminPaymentMethod = 'CARD' | 'TRANSFER' | 'CASH' | 'PAYPAL' | 'OTHER';

export interface AdminPaymentDTO {
    id: string;
    paymentId?: string;
    orderId: string;
    userId?: string | null;
    amount: number;
    currency?: string;
    fees?: number;
    netAmount?: number;
    status: AdminPaymentStatus;
    method?: AdminPaymentMethod;
    provider?: string;
    reference?: string | null;
    externalPaymentId?: string | null;
    clientSecret?: string | null;
    createdAt: string;
    updatedAt: string;
}
