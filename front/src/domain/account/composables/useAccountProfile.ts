import { useQuery } from '@tanstack/vue-query';
import { getAccountProfile } from '../services';

export const useAccountProfile = () => {
    return useQuery({
        queryKey: ['account', 'profile'],
        queryFn: () => getAccountProfile(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};
