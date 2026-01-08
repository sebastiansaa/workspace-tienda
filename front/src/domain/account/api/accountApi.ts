import { axiosAdapter } from '@/shared/api/axiosAdapter';
import type { AxiosResponse } from 'axios';
import type { AddressPayload, UpdateUserProfilePayload, UserProfile } from '../interfaces';

export const accountApi = {
    getProfile: (): Promise<AxiosResponse<UserProfile>> => axiosAdapter.get('/users/me'),
    updateProfile: (body: UpdateUserProfilePayload): Promise<AxiosResponse<UserProfile>> =>
        axiosAdapter.patch('/users/me', body),
    addAddress: (body: AddressPayload): Promise<AxiosResponse<UserProfile>> => axiosAdapter.post('/users/me/addresses', body),
    updateAddress: (id: string, body: AddressPayload): Promise<AxiosResponse<UserProfile>> =>
        axiosAdapter.patch(`/users/me/addresses/${id}`, body),
    deleteAddress: (id: string): Promise<AxiosResponse<void>> => axiosAdapter.delete(`/users/me/addresses/${id}`),
};
