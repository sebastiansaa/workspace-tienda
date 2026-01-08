import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminCategoryDTO } from "../interfaces";
import { getAdminCategories } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminCategories = () => {
    const q = useQuery<AdminCategoryDTO[]>({
        queryKey: ["admin", "categories"],
        queryFn: () => getAdminCategories(),
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });

    return {
        ...q,
        categories: computed(() => q.data.value ?? []),
    };
};
