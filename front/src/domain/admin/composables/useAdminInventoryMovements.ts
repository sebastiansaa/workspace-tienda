import { unref } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getAdminInventoryMovements } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";
import type { AdminInventoryMovementDTO } from "../interfaces";

type MaybeProductId =
    | number
    | null
    | undefined
    | Ref<number | null | undefined>
    | ComputedRef<number | null | undefined>;

export const useAdminInventoryMovements = (
    productId: MaybeProductId,
) => {
    return useQuery<AdminInventoryMovementDTO[]>({
        queryKey: ["admin", "inventory", productId, "movements"],
        queryFn: async () => {
            const value = unref(productId);
            if (!value) return [] as AdminInventoryMovementDTO[];
            return await getAdminInventoryMovements(value);
        },
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });
};
