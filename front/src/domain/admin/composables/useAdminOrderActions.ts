import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { cancelAdminOrder, payAdminOrder, completeAdminOrder } from "../services";

export type AdminOrderAction = "cancel" | "pay" | "complete";

export const useAdminOrderActions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, action }: { id: string; action: AdminOrderAction }) => {
            switch (action) {
                case "cancel":
                    return await cancelAdminOrder(id);
                case "pay":
                    return await payAdminOrder(id);
                case "complete":
                    return await completeAdminOrder(id);
                default:
                    throw new Error(`Unsupported action ${action}`);
            }
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
        },
    });
};
