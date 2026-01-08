import { PRODUCT_IMAGE_PLACEHOLDER } from './productImages'

export function handleImageError(event: Event): void {
  const img = event.target as HTMLImageElement
  img.src = PRODUCT_IMAGE_PLACEHOLDER
}
