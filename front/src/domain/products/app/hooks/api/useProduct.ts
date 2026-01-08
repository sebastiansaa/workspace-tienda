import { useQuery } from '@tanstack/vue-query'
import { FindProductByIdUsecase } from '../../usecases/FindProductByIdUsecase'

const usecase = new FindProductByIdUsecase()

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => usecase.execute(id),
    enabled: !!id,
  })
}
