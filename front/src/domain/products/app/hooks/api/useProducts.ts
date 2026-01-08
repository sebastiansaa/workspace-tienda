import { useQuery } from '@tanstack/vue-query'
import { ListProductsUsecase } from '../../usecases/ListProductsUsecase'
import type { ListProductsQuery } from '../../../types/backendShape'

const usecase = new ListProductsUsecase()

export function useProducts(query?: ListProductsQuery) {
  return useQuery({
    queryKey: ['products', query],
    queryFn: () => usecase.execute(query),
    staleTime: 5 * 60 * 1000, // 5 min
  })
}



