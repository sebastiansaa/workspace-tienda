import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { AddItemToCartUsecase } from '../../usecase/AddItemToCartUsecase'

const usecase = new AddItemToCartUsecase()

export function useAddItemToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: { productId: number; quantity: number }) => usecase.execute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
