export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface UserAddress {
    id: string;
    street: string;
    city: string;
    country: string;
    zipCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    roles?: string[];
    status: UserStatus;
    preferences: Record<string, unknown> | null;
    addresses: UserAddress[];
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserProfilePayload {
    name?: string;
    phone?: string;
    preferences?: Record<string, unknown>;
}

export interface AddressPayload {
    street: string;
    city: string;
    country: string;
    zipCode: string;
}
