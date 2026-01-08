import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { SaveProductUsecase } from '../../usecases/SaveProductUsecase'
import type { SaveProductDto } from '../../../types/backendShape'

const usecase = new SaveProductUsecase()

export function useSaveProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: SaveProductDto) => usecase.execute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
