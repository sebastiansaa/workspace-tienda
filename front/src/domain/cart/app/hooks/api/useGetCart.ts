import { useQuery } from '@tanstack/vue-query'
import { GetCartUsecase } from '../../usecase/GetCartUsecase'

const usecase = new GetCartUsecase()

export function useGetCart() {
    return useQuery({
        queryKey: ['cart'],
        queryFn: () => usecase.execute(),
        staleTime: 5 * 60 * 1000, // 5 min
    })
}
