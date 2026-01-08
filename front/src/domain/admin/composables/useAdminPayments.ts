import { computed, unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminListQuery, AdminPaymentDTO } from "../interfaces";
import { getAdminPayments } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminPayments = (query?: Ref<AdminListQuery | undefined> | AdminListQuery) => {
    const queryRef = computed(() => unref(query));

    const q = useQuery<AdminPaymentDTO[]>({
        queryKey: ["admin", "payments", queryRef],
        queryFn: () => getAdminPayments(queryRef.value),
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });

    return {
        ...q,
        payments: computed(() => q.data.value ?? []),
    };
};
