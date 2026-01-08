import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ClearCartUsecase } from '../../usecase/ClearCartUsecase'

const usecase = new ClearCartUsecase()

export function useClearCart() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => usecase.execute(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}
