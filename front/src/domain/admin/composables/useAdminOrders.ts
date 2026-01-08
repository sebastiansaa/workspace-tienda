import { computed, unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminListQuery, AdminOrderDTO } from "../interfaces";
import { getAdminOrders } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminOrders = (query?: Ref<AdminListQuery | undefined> | AdminListQuery) => {
    const queryRef = computed(() => unref(query));

    const q = useQuery<AdminOrderDTO[]>({
        queryKey: ["admin", "orders", queryRef],
        queryFn: () => getAdminOrders(queryRef.value),
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });

    return {
        ...q,
        orders: computed(() => q.data.value ?? []),
    };
};
