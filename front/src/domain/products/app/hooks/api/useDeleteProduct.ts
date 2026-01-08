import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { DeleteProductUsecase } from '../../usecases/DeleteProductUsecase'

const usecase = new DeleteProductUsecase()

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, hard }: { id: number; hard?: boolean }) => usecase.execute(id, hard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
