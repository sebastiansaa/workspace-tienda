import { unref } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminInventoryDTO } from "../interfaces";
import { getAdminInventoryByProductId } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

// Wrapper kept for compatibility; now it fetches a single product inventory.
type MaybeProductId =
    | number
    | null
    | undefined
    | Ref<number | null | undefined>
    | ComputedRef<number | null | undefined>;

export const useAdminInventory = (productId: MaybeProductId) => {
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
