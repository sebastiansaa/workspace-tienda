import { unref } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { AdminPaymentDTO } from "../interfaces";
import { getAdminPaymentById } from "../services";
import { ADMIN_CONFIG } from "../config/admin.config";

export const useAdminPayment = (id: Ref<string> | string) => {
    return useQuery<AdminPaymentDTO | undefined>({
        queryKey: ["admin", "payments", id],
        queryFn: async () => {
            const value = unref(id);
            if (!value) return undefined;
            return await getAdminPaymentById(value);
        },
        staleTime: ADMIN_CONFIG.cache.staleTime,
        gcTime: ADMIN_CONFIG.cache.gcTime,
        retry: ADMIN_CONFIG.cache.retry,
    });
};
