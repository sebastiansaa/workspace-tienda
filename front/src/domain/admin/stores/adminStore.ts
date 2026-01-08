import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { logger } from "@/shared/services/logger";

export const useAdminStore = defineStore("admin", () => {
  const _selectedUserId = ref<string | null>(null);
  const _selectedProductId = ref<number | null>(null);
  const _selectedOrderId = ref<string | null>(null);
  const _selectedPaymentId = ref<string | null>(null);
  const _selectedInventoryProductId = ref<number | null>(null);

  const selectedUserId = computed(() => _selectedUserId.value);
  const selectedProductId = computed(() => _selectedProductId.value);
  const selectedOrderId = computed(() => _selectedOrderId.value);
  const selectedPaymentId = computed(() => _selectedPaymentId.value);
  const selectedInventoryProductId = computed(() => _selectedInventoryProductId.value);

  const selectUser = (id: string | null) => {
    logger.debug(`[adminStore] selectUser: ${id ?? "null"}`);
    _selectedUserId.value = id;
  };

  const selectProduct = (id: number | null) => {
    logger.debug(`[adminStore] selectProduct: ${id ?? "null"}`);
    _selectedProductId.value = id;
  };

  const selectOrder = (id: string | null) => {
    logger.debug(`[adminStore] selectOrder: ${id ?? "null"}`);
    _selectedOrderId.value = id;
  };

  const selectPayment = (id: string | null) => {
    logger.debug(`[adminStore] selectPayment: ${id ?? "null"}`);
    _selectedPaymentId.value = id;
  };

  const selectInventoryProduct = (id: number | null) => {
    logger.debug(`[adminStore] selectInventoryProduct: ${id ?? "null"}`);
    _selectedInventoryProductId.value = id;
  };

  const resetSelections = () => {
    logger.debug("[adminStore] resetSelections");
    _selectedUserId.value = null;
    _selectedProductId.value = null;
    _selectedOrderId.value = null;
    _selectedPaymentId.value = null;
    _selectedInventoryProductId.value = null;
  };

  return {
    selectedUserId,
    selectedProductId,
    selectedOrderId,
    selectedPaymentId,
    selectedInventoryProductId,
    selectUser,
    selectProduct,
    selectOrder,
    selectPayment,
    selectInventoryProduct,
    resetSelections,
  };
});

export default useAdminStore;
