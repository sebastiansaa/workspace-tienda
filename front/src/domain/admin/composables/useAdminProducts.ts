import { computed, unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminListQuery, AdminProductDTO } from "../interfaces";
import { getAdminProducts } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminProducts = (query?: Ref<AdminListQuery | undefined> | AdminListQuery) => {
    const queryRef = computed(() => unref(query));

    const q = useQuery<AdminProductDTO[]>({
        queryKey: ["admin", "products", queryRef],
        queryFn: () => getAdminProducts(queryRef.value),
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });

    return {
        ...q,
        products: computed(() => q.data.value ?? []),
    };
};
