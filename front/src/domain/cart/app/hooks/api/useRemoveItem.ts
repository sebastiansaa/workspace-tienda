import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { RemoveItemUsecase } from '../../usecase/RemoveItemUsecase'

const usecase = new RemoveItemUsecase()

export function useRemoveItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (productId: number) => usecase.execute(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}
