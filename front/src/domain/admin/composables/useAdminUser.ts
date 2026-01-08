import { unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminUserDTO } from "../interfaces";
import { getAdminUserById } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminUser = (id: Ref<string> | string) => {
    return useQuery<AdminUserDTO | undefined>({
        queryKey: ["admin", "users", id],
        queryFn: async () => {
            const value = unref(id);
            if (!value) return undefined;
            return await getAdminUserById(value);
        },
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });
};
