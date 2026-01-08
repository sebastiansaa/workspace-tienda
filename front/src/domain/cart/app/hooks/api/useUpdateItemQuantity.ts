import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { UpdateItemQuantityUsecase } from '../../usecase/UpdateItemQuantityUsecase'

const usecase = new UpdateItemQuantityUsecase()

export function useUpdateItemQuantity() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) => usecase.execute(productId, { quantity }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
    })
}
