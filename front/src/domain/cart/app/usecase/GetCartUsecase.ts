import { cartApi } from '../../api/cartApi'
import type { CartDTO } from '../../types/BackendShapeCart'

export class GetCartUsecase {
    async execute(): Promise<CartDTO> {
        const response = await cartApi.get()
        return response.data
    }
}
