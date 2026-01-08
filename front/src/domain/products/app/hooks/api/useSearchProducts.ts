import { useQuery } from '@tanstack/vue-query'
import { SearchProductsUsecase } from '../../usecases/SearchProductsUsecase'
import type { SearchProductsQuery } from '../../../types/backendShape'

const usecase = new SearchProductsUsecase()

export function useSearchProducts(query?: SearchProductsQuery) {
  return useQuery({
    queryKey: ['products-search', query],
    queryFn: () => usecase.execute(query),
    enabled: !!query?.query,
  })
}
