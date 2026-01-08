import { useRouter } from 'vue-router'
import type { ProductResponse } from '../../../types/backendShape'

//para redirigir a vistas de producto desde listas o tarjetas, manteniendo la navegación tipada y reutilizable.
// No maneja estado ni lógica de negocio, solo routing.
export function useProductNavigation() {
  const router = useRouter()

  const navigateToProduct = (product: ProductResponse) => {
    router.push(`/product/${product.id}`)
  }

  return {
    navigateToProduct,
  }
}
