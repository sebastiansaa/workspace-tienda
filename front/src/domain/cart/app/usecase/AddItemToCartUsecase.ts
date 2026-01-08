import { cartApi } from '../../api/cartApi'
import { addItemSchema, type AddItemDto } from '../../types/cart.schemas'
import type { CartDTO } from '../../types/BackendShapeCart'

export class AddItemToCartUsecase {
    async execute(dto: AddItemDto): Promise<CartDTO> {
        addItemSchema.parse(dto)
        const response = await cartApi.addItem(dto)
        return response.data
    }
}
