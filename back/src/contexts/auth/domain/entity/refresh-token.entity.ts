import { randomUUID } from 'crypto';
import TimestampVO from '../v-o/timestamp.vo';

export interface RefreshTokenProps {
    id?: string; // UUID
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt?: Date;
}

export class RefreshTokenEntity {
    private readonly idInternal: string;
    private readonly userIdInternal: string;
    private readonly tokenHashInternal: string;
    private expiresAtVO: TimestampVO;
    private createdAtVO: TimestampVO;

    private constructor(props: RefreshTokenProps) {
        this.idInternal = props.id ?? randomUUID();
        this.userIdInternal = props.userId;
        this.tokenHashInternal = props.tokenHash;
        this.expiresAtVO = TimestampVO.from(props.expiresAt);
        this.createdAtVO = TimestampVO.from(props.createdAt);
    }

    static create(props: Omit<RefreshTokenProps, 'id' | 'createdAt'> & { id?: string }): RefreshTokenEntity {
        const createdAt = TimestampVO.now().value;
        return new RefreshTokenEntity({ ...props, id: props.id ?? randomUUID(), createdAt });
    }

    static rehydrate(props: RefreshTokenProps): RefreshTokenEntity {
        return new RefreshTokenEntity(props);
    }

    get id(): string {
        return this.idInternal;
    }

    get userId(): string {
        return this.userIdInternal;
    }

    get tokenHash(): string {
        return this.tokenHashInternal;
    }

    get expiresAt(): Date {
        return this.expiresAtVO.value;
    }

    get createdAt(): Date {
        return this.createdAtVO.value;
    }

    isExpired(now: Date = new Date()): boolean {
        return this.expiresAt.getTime() <= now.getTime();
    }

    withNewExpiration(expiresAt: Date): RefreshTokenEntity {
        return RefreshTokenEntity.rehydrate({
            id: this.idInternal,
            userId: this.userIdInternal,
            tokenHash: this.tokenHashInternal,
            expiresAt,
            createdAt: this.createdAt,
        });
    }
}
