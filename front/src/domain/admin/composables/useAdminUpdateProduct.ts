import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { UpdateProductDto } from "../interfaces";
import { updateAdminProduct } from "../services";

export const useAdminUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateProductDto }) => updateAdminProduct(id, body),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "products", variables.id] });
        },
    });
};
