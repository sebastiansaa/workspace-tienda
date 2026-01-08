import { unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminOrderDTO } from "../interfaces";
import { getAdminOrderById } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminOrder = (id: Ref<string> | string) => {
    return useQuery<AdminOrderDTO | undefined>({
        queryKey: ["admin", "orders", id],
        queryFn: async () => {
            const value = unref(id);
            if (!value) return undefined;
            return await getAdminOrderById(value);
        },
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });
};
