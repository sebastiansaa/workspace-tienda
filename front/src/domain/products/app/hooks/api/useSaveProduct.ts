import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { SaveProductUsecase } from '../../usecases/SaveProductUsecase'
import type { CreateProductDto } from '../../../types/backendShape'

const usecase = new SaveProductUsecase()

export function useSaveProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateProductDto) => usecase.execute(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
