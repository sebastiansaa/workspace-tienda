import { cartApi } from '../../api/cartApi'
import type { CartDTO } from '../../types/BackendShapeCart'

export class RemoveItemUsecase {
    async execute(productId: number): Promise<CartDTO> {
        const response = await cartApi.removeItem(productId)
        return response.data
    }
}
