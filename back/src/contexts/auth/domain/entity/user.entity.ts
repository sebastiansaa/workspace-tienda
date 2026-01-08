import { randomUUID } from 'crypto';
import { EmailVO } from '../../../shared/v-o/email.vo';
import { PasswordHashVO } from '../v-o/password-hash.vo';
import { RoleVO } from '../v-o/role.vo';
import TimestampVO from '../v-o/timestamp.vo';

export interface UserProps {
    id?: string; // UUID
    email: string;
    passwordHash: string;
    roles?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserEntity {
    private readonly idInternal: string;
    private readonly emailVO: EmailVO;
    private passwordHashVO: PasswordHashVO;
    private rolesVO: RoleVO[];
    private createdAtVO: TimestampVO;
    private updatedAtVO: TimestampVO;

    private constructor(props: UserProps) {
        this.idInternal = props.id ?? randomUUID();
        this.emailVO = new EmailVO(props.email);
        this.passwordHashVO = new PasswordHashVO(props.passwordHash);
        this.rolesVO = this.buildRoles(props.roles ?? ['user']);
        this.createdAtVO = TimestampVO.from(props.createdAt);
        this.updatedAtVO = TimestampVO.from(props.updatedAt ?? props.createdAt);
    }

    static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): UserEntity {
        const now = TimestampVO.now().value;
        return new UserEntity({ ...props, id: props.id ?? randomUUID(), createdAt: now, updatedAt: now });
    }

    static rehydrate(props: UserProps): UserEntity {
        return new UserEntity(props);
    }

    get id(): string {
        return this.idInternal;
    }

    get email(): string {
        return this.emailVO.value;
    }

    get roles(): string[] {
        return this.rolesVO.map((role) => role.value);
    }

    get passwordHash(): string {
        return this.passwordHashVO.value;
    }

    get createdAt(): Date {
        return this.createdAtVO.value;
    }

    get updatedAt(): Date {
        return this.updatedAtVO.value;
    }

    changeRoles(roles: string[]): void {
        this.rolesVO = this.buildRoles(roles);
        this.touch();
    }

    setPasswordHash(hash: string): void {
        this.passwordHashVO = new PasswordHashVO(hash);
        this.touch();
    }

    private buildRoles(roles: string[]): RoleVO[] {
        const fallback = roles.length === 0 ? ['user'] : roles;
        const unique = Array.from(new Set(fallback));
        return unique.map((role) => new RoleVO(role));
    }

    private touch(): void {
        this.updatedAtVO = TimestampVO.now();
    }
}
