import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { uploadAdminProductImage } from "../services";
import type { UploadImageResponse } from "../interfaces";

export const useAdminUploadProductImage = () => {
    const queryClient = useQueryClient();

    return useMutation<UploadImageResponse, unknown, { id: number; file: File }>({
        mutationFn: ({ id, file }) => uploadAdminProductImage(id, file),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "products", variables.id] });
        },
    });
};
