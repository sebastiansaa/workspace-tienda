import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { UpdateStockUsecase } from '../../usecases/UpdateStockUsecase'
import type { UpdateStockDto } from '../../../types/backendShape'

const usecase = new UpdateStockUsecase()

export function useUpdateStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateStockDto }) => usecase.execute(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
