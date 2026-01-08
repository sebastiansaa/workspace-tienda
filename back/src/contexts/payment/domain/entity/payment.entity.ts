import PaymentIdVO from '../v-o/payment-id.vo';
import OrderIdVO from '../v-o/order-id.vo';
import UserIdVO from '../v-o/user-id.vo';
import AmountVO from '../v-o/amount.vo';
import PaymentStatusVO, { PaymentStatus } from '../v-o/payment-status.vo';
import ExternalPaymentIdVO from '../v-o/external-payment-id.vo';
import ClientSecretVO from '../v-o/client-secret.vo';
import CreatedAtVO from '../v-o/created-at.vo';
import UpdatedAtVO from '../v-o/updated-at.vo';
import { InvalidPaymentStateError, PaymentAlreadyProcessedError } from '../errors/payment.errors';

export interface PaymentProps {
    id?: string;
    orderId: string;
    userId: string;
    amount: number;
    status?: PaymentStatus;
    externalPaymentId?: string | null;
    clientSecret?: string | null;
    provider?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class PaymentEntity {
    private readonly idVO: PaymentIdVO;
    private readonly orderIdVO: OrderIdVO;
    private readonly userIdVO: UserIdVO;
    private readonly amountVO: AmountVO;
    private statusVO: PaymentStatusVO;
    private externalPaymentIdVO?: ExternalPaymentIdVO;
    private clientSecretVO?: ClientSecretVO;
    private providerValue: string;
    private createdAtVO: CreatedAtVO;
    private updatedAtVO: UpdatedAtVO;

    private constructor(props: PaymentProps) {
        this.idVO = new PaymentIdVO(props.id);
        this.orderIdVO = new OrderIdVO(props.orderId);
        this.userIdVO = new UserIdVO(props.userId);
        this.amountVO = new AmountVO(props.amount);
        this.statusVO = new PaymentStatusVO(props.status ?? 'PENDING');
        if (props.externalPaymentId) {
            this.externalPaymentIdVO = new ExternalPaymentIdVO(props.externalPaymentId);
        }
        if (props.clientSecret) {
            this.clientSecretVO = new ClientSecretVO(props.clientSecret);
        }
        this.providerValue = props.provider ?? 'FAKE';
        this.createdAtVO = new CreatedAtVO(props.createdAt);
        this.updatedAtVO = UpdatedAtVO.from(props.updatedAt);
    }

    static create(props: Omit<PaymentProps, 'createdAt' | 'updatedAt'>): PaymentEntity {
        const now = new Date();
        return new PaymentEntity({ ...props, createdAt: now, updatedAt: now });
    }

    static rehydrate(props: PaymentProps): PaymentEntity {
        return new PaymentEntity(props);
    }

    get id(): string {
        return this.idVO.value;
    }

    get orderId(): string {
        return this.orderIdVO.value;
    }

    get userId(): string {
        return this.userIdVO.value;
    }

    get amount(): number {
        return this.amountVO.value;
    }

    get status(): PaymentStatus {
        return this.statusVO.value;
    }

    get externalPaymentId(): string | undefined {
        return this.externalPaymentIdVO?.value;
    }

    get clientSecret(): string | undefined {
        return this.clientSecretVO?.value;
    }

    get provider(): string {
        return this.providerValue;
    }

    get createdAt(): Date {
        return this.createdAtVO.value;
    }

    get updatedAt(): Date {
        return this.updatedAtVO.value;
    }

    setExternalInfo(externalPaymentId?: string, clientSecret?: string): void {
        if (externalPaymentId) this.externalPaymentIdVO = new ExternalPaymentIdVO(externalPaymentId);
        if (clientSecret) this.clientSecretVO = new ClientSecretVO(clientSecret);
        this.touch();
    }

    markAuthorized(): void {
        this.ensureNotFinished();
        if (this.statusVO.value !== 'PENDING') throw new InvalidPaymentStateError();
        this.statusVO = new PaymentStatusVO('AUTHORIZED');
        this.touch();
    }

    markPaid(): void {
        this.ensureNotFinished();
        if (this.statusVO.value === 'PENDING' || this.statusVO.value === 'AUTHORIZED') {
            this.statusVO = new PaymentStatusVO('PAID');
            this.touch();
            return;
        }
        throw new InvalidPaymentStateError();
    }

    markFailed(): void {
        if (this.statusVO.value === 'PAID') throw new PaymentAlreadyProcessedError('Payment already paid');
        this.statusVO = new PaymentStatusVO('FAILED');
        this.touch();
    }

    private ensureNotFinished(): void {
        if (this.statusVO.value === 'PAID' || this.statusVO.value === 'FAILED') {
            throw new PaymentAlreadyProcessedError();
        }
    }

    private touch(): void {
        this.updatedAtVO = UpdatedAtVO.now();
    }
}

export default PaymentEntity;
