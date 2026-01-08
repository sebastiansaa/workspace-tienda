import { cartApi } from '../../api/cartApi'

export class ClearCartUsecase {
    async execute(): Promise<void> {
        await cartApi.clearCart()
    }
}
