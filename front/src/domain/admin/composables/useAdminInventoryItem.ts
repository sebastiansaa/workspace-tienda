import { unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminInventoryDTO } from "../interfaces";
import { getAdminInventoryByProductId } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminInventoryItem = (productId: Ref<number> | number) => {
    return useQuery<AdminInventoryDTO | undefined>({
        queryKey: ["admin", "inventory", productId],
        queryFn: async () => {
            const value = unref(productId);
            if (!value) return undefined;
            return await getAdminInventoryByProductId(value);
        },
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });
};
