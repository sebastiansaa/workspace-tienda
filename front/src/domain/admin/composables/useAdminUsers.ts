import { computed, unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminListQuery, AdminUserDTO } from "../interfaces";
import { getAdminUsers } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminUsers = (query?: Ref<AdminListQuery | undefined> | AdminListQuery) => {
    const queryRef = computed(() => unref(query));

    const q = useQuery<AdminUserDTO[]>({
        queryKey: ["admin", "users", queryRef],
        queryFn: () => getAdminUsers(queryRef.value),
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });

    return {
        ...q,
        users: computed(() => q.data.value ?? []),
    };
};
