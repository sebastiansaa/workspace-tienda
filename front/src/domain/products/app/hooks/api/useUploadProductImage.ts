import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { UploadProductImageUsecase } from '../../usecases/UploadProductImageUsecase'

const usecase = new UploadProductImageUsecase()

export function useUploadProductImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => usecase.execute(id, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
  })
}
