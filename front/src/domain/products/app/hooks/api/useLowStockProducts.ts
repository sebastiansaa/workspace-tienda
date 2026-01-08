import { useQuery } from '@tanstack/vue-query'
import { FindLowStockUsecase } from '../../usecases/FindLowStockUsecase'

const usecase = new FindLowStockUsecase()

export function useLowStockProducts(threshold = 5) {
  return useQuery({
    queryKey: ['products-low-stock', threshold],
    queryFn: () => usecase.execute(threshold),
  })
}
