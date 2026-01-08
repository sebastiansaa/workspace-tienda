import { unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminCategoryDTO } from "../interfaces";
import { getAdminCategoryById } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminCategory = (id: Ref<number> | number) => {
    return useQuery<AdminCategoryDTO | undefined>({
        queryKey: ["admin", "categories", id],
        queryFn: async () => {
            const value = unref(id);
            if (!value) return undefined;
            return await getAdminCategoryById(value);
        },
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });
};
