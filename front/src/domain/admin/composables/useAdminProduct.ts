import { unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminProductDTO } from "../interfaces";
import { getAdminProductById } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminProduct = (id: Ref<number> | number) => {
    return useQuery<AdminProductDTO | undefined>({
        queryKey: ["admin", "products", id],
        queryFn: async () => {
            const value = unref(id);
            if (!value) return undefined;
            return await getAdminProductById(value);
        },
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });
};
