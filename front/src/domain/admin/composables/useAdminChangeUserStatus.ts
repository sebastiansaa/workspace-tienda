import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { ChangeUserStatusDto } from "../interfaces";
import { changeAdminUserStatus } from "../services";

export const useAdminChangeUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: ChangeUserStatusDto }) => changeAdminUserStatus(id, body),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "users", variables.id] });
        },
    });
};
