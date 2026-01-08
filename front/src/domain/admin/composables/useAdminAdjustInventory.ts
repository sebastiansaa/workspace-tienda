import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { AdjustStockDto, AdjustStockType } from "../interfaces";
import {
    increaseAdminInventory,
    decreaseAdminInventory,
    reserveAdminInventory,
    releaseAdminInventory,
} from "../services";

export const useAdminAdjustInventory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, body }: { productId: number; body: AdjustStockDto }) => {
            const type = body.type as AdjustStockType;
            switch (type) {
                case "INCREASE":
                    return increaseAdminInventory(productId, body);
                case "DECREASE":
                    return decreaseAdminInventory(productId, body);
                case "RESERVE":
                    return reserveAdminInventory(productId, body);
                case "RELEASE":
                    return releaseAdminInventory(productId, body);
                default:
                    throw new Error("Invalid adjust type");
            }
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "inventory", variables.productId] });
            queryClient.invalidateQueries({ queryKey: ["admin", "products", variables.productId] });
            queryClient.invalidateQueries({ queryKey: ["admin", "inventory", variables.productId, "movements"] });
        },
    });
};
