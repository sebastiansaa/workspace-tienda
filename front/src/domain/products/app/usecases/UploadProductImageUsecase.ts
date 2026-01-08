import { productsClient } from '../../api/productsApi'

export class UploadProductImageUsecase {
    async execute(id: number, formData: FormData): Promise<{ productId: number; filename: string; path: string }> {
        return productsClient.uploadProductImage(id, formData)
    }
}
