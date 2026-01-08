import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { RestoreProductUsecase } from '../../usecases/RestoreProductUsecase'

const usecase = new RestoreProductUsecase()

export function useRestoreProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usecase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
