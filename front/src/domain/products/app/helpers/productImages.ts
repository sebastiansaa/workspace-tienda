export const PRODUCT_IMAGE_PLACEHOLDER = '/images/placeholder.png'

export function resolveProductImages(images?: string[] | null): string[] {
    if (!images || images.length === 0) {
        return [PRODUCT_IMAGE_PLACEHOLDER]
    }

    return images
}

export function getPrimaryProductImage(images?: string[] | null): string {
    return resolveProductImages(images)[0] || PRODUCT_IMAGE_PLACEHOLDER
}
