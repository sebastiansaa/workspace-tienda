import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { addAccountAddress, deleteAccountAddress, updateAccountAddress, updateAccountProfile } from '../services';
import type { AddressPayload, UpdateUserProfilePayload } from '../interfaces';

const invalidateProfile = (queryClient: ReturnType<typeof useQueryClient>) => {
    queryClient.invalidateQueries({ queryKey: ['account', 'profile'] });
};

export const useUpdateAccountProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateUserProfilePayload) => updateAccountProfile(payload),
        onSuccess: () => invalidateProfile(queryClient),
    });
};

export const useAddAccountAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AddressPayload) => addAccountAddress(payload),
        onSuccess: () => invalidateProfile(queryClient),
    });
};

export const useUpdateAccountAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: AddressPayload }) => updateAccountAddress(id, payload),
        onSuccess: () => invalidateProfile(queryClient),
    });
};

export const useDeleteAccountAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAccountAddress(id),
        onSuccess: () => invalidateProfile(queryClient),
    });
};
