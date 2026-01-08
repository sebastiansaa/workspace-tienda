import { cartApi } from '../../api/cartApi'
import { updateQuantitySchema, type UpdateQuantityDto } from '../../types/cart.schemas'
import type { CartDTO } from '../../types/BackendShapeCart'

export class UpdateItemQuantityUsecase {
    async execute(productId: number, dto: UpdateQuantityDto): Promise<CartDTO> {
        updateQuantitySchema.parse(dto)
        const response = await cartApi.updateQuantity(productId, dto.quantity)
        return response.data
    }
}
