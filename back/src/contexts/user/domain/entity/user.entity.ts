import { EmailVO, NameVO, DateVO, Slug } from '../../../shared/v-o';
import UserStatusVO, { UserStatus } from '../v-o/user-status.vo';
import AddressEntity, { AddressProps } from './address.entity';
import { AddressNotFoundError, InvalidAddressError } from '../errors/user.errors';
import PhoneVO from '../v-o/phone.vo';
import PreferencesVO from '../v-o/preferences.vo';

export interface UserProps {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
    status?: UserStatus;
    preferences?: Record<string, unknown> | null;
    addresses?: AddressProps[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserEntity {
    private readonly idVO: Slug;
    private emailVO: EmailVO;
    private nameVO: NameVO;
    private phoneVO: PhoneVO;
    private statusVO: UserStatusVO;
    private preferencesVO: PreferencesVO;
    private addressesInternal: AddressEntity[];
    private createdAtVO: DateVO;
    private updatedAtVO: DateVO;

    private constructor(props: UserProps) {
        this.idVO = new Slug(props.id);
        this.emailVO = new EmailVO(props.email);
        this.nameVO = new NameVO(props.name);
        this.phoneVO = new PhoneVO(props.phone ?? null);
        this.statusVO = new UserStatusVO(props.status ?? 'ACTIVE');
        this.preferencesVO = new PreferencesVO(props.preferences ?? null);
        this.addressesInternal = (props.addresses ?? []).map((a) => AddressEntity.rehydrate(a));
        this.createdAtVO = new DateVO(props.createdAt);
        this.updatedAtVO = DateVO.from(props.updatedAt);
    }

    static create(props: Omit<UserProps, 'createdAt' | 'updatedAt'>): UserEntity {
        const now = new Date();
        return new UserEntity({ ...props, createdAt: now, updatedAt: now });
    }

    static rehydrate(props: UserProps): UserEntity {
        return new UserEntity(props);
    }

    get id(): string { return this.idVO.value; }
    get email(): string { return this.emailVO.value; }
    get name(): string { return this.nameVO.value; }
    get phone(): string | null { return this.phoneVO.value; }
    get status(): UserStatus { return this.statusVO.value; }
    get preferences(): Record<string, unknown> | null { return this.preferencesVO.value; }
    get addresses(): AddressEntity[] {
        return this.addressesInternal.map((address) => AddressEntity.rehydrate({
            id: address.id,
            street: address.street,
            city: address.city,
            country: address.country,
            zipCode: address.zipCode,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
        }));
    }
    get createdAt(): Date { return this.createdAtVO.value; }
    get updatedAt(): Date { return this.updatedAtVO.value; }

    updateProfile(data: { name?: string; phone?: string | null; preferences?: Record<string, unknown> | null }): void {
        if (data.name !== undefined) this.nameVO = new NameVO(data.name);
        if (data.phone !== undefined) this.phoneVO = new PhoneVO(data.phone ?? null);
        if (data.preferences !== undefined) this.preferencesVO = new PreferencesVO(data.preferences ?? null);
        this.touch();
    }

    addAddress(address: AddressProps): AddressEntity {
        const entity = AddressEntity.create(address);
        if (this.addressesInternal.some((a) => a.id === entity.id)) {
            throw new InvalidAddressError('Address already exists');
        }
        this.addressesInternal = [...this.addressesInternal, entity];
        this.touch();
        return entity;
    }

    updateAddress(addressId: string, data: Partial<AddressProps>): AddressEntity {
        const addr = this.addressesInternal.find((a) => a.id === addressId);
        if (!addr) throw new AddressNotFoundError('Address not found');
        addr.update(data);
        this.touch();
        return addr;
    }

    deleteAddress(addressId: string): void {
        const exists = this.addressesInternal.some((a) => a.id === addressId);
        if (!exists) throw new AddressNotFoundError('Address not found');
        this.addressesInternal = this.addressesInternal.filter((a) => a.id !== addressId);
        this.touch();
    }

    changeStatus(status: UserStatus): void {
        this.statusVO = new UserStatusVO(status);
        this.touch();
    }

    private touch(): void {
        this.updatedAtVO = DateVO.now();
    }
}

export default UserEntity;
