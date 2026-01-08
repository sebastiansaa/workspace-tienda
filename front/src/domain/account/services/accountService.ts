import { accountApi } from '../api/accountApi';
import type { AddressPayload, UpdateUserProfilePayload, UserProfile, UserAddress } from '../interfaces';

const mapAddress = (address: UserAddress): UserAddress => ({
    ...address,
    street: address.street ?? '',
    city: address.city ?? '',
    country: address.country ?? '',
    zipCode: address.zipCode ?? '',
});

const mapProfile = (dto: UserProfile): UserProfile => ({
    ...dto,
    name: dto.name ?? null,
    phone: dto.phone ?? null,
    preferences: dto.preferences ?? null,
    addresses: (dto.addresses ?? []).map(mapAddress),
});

export const getAccountProfile = async (): Promise<UserProfile> => {
    const response = await accountApi.getProfile();
    return mapProfile(response.data);
};

export const updateAccountProfile = async (payload: UpdateUserProfilePayload): Promise<UserProfile> => {
    const response = await accountApi.updateProfile(payload);
    return mapProfile(response.data);
};

export const addAccountAddress = async (payload: AddressPayload): Promise<UserProfile> => {
    const response = await accountApi.addAddress(payload);
    return mapProfile(response.data);
};

export const updateAccountAddress = async (addressId: string, payload: AddressPayload): Promise<UserProfile> => {
    const response = await accountApi.updateAddress(addressId, payload);
    return mapProfile(response.data);
};

export const deleteAccountAddress = async (addressId: string): Promise<void> => {
    await accountApi.deleteAddress(addressId);
};
