export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED';

const allowed: PaymentStatus[] = ['PENDING', 'AUTHORIZED', 'PAID', 'FAILED'];

export class PaymentStatusVO {
    private readonly _value: PaymentStatus;

    constructor(value: PaymentStatus) {
        if (!allowed.includes(value)) throw new Error('Invalid payment status');
        this._value = value;
    }

    static pending(): PaymentStatusVO {
        return new PaymentStatusVO('PENDING');
    }

    get value(): PaymentStatus {
        return this._value;
    }
}

export default PaymentStatusVO;
