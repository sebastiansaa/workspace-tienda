import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { logger } from "@/shared/services/logger";
import type { ProductResponse } from "../types/backendShape";

//gestiona la selección de un producto único en la aplicación. Mantiene un estado interno con el producto seleccionado
export const useProductsStore = defineStore('products', () => {
  // Estado interno (privado)
  const _selectedProduct = ref<ProductResponse | null>(null);

  // Getters (computed)
  const selectedProduct = computed(() => _selectedProduct.value);

  // Actions
  const selectProduct = (product: ProductResponse) => {
    logger.debug(`[productsStore] selectProduct: ${product.id}`);
    _selectedProduct.value = product;
  };

  const clearSelection = () => {
    logger.debug('[productsStore] clearSelection');
    _selectedProduct.value = null;
  };

  return {
    // Getters (readonly computed)
    selectedProduct,
    // Actions
    selectProduct,
    clearSelection,
  };
});
