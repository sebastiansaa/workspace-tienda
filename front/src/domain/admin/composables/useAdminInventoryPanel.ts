import { computed, reactive, ref, watchEffect } from 'vue'
import { useToast } from 'vue-toastification'
import { useAdminStore } from '../stores/adminStore'
import { useAdminAdjustInventory, useAdminInventory, useAdminInventoryMovements } from '.'
import type { AdjustStockDto } from '../interfaces'

export const useAdminInventoryPanel = () => {
    const adminStore = useAdminStore()
    const toast = useToast()

    const productId = computed(
        () => adminStore.selectedInventoryProductId || adminStore.selectedProductId || null,
    )
    const selectedProductId = computed(() => adminStore.selectedProductId)
    const productIdInput = ref<number | null>(productId.value)

    const { mutateAsync, isPending: isMutating } = useAdminAdjustInventory()
    const { data: inventoryData, isLoading } = useAdminInventory(productId)
    const { data: movementsData, isLoading: movementsLoading } = useAdminInventoryMovements(productId)

    const inventory = computed(() => inventoryData.value ?? null)
    const movements = computed(() => movementsData.value ?? [])

    const form = reactive<AdjustStockDto>({
        quantity: 1,
        reason: 'MANUAL_ADJUSTMENT',
        type: 'INCREASE',
    })

    const applyProductId = () => {
        if (productIdInput.value) {
            adminStore.selectInventoryProduct(productIdInput.value)
        }
    }

    const applySelectedProduct = () => {
        if (selectedProductId.value) {
            adminStore.selectInventoryProduct(selectedProductId.value)
            productIdInput.value = selectedProductId.value
            toast.info('Producto seleccionado aplicado al inventario')
        }
    }

    watchEffect(() => {
        productIdInput.value = productId.value
    })

    const resetForm = () => {
        form.quantity = 1
        form.reason = 'MANUAL_ADJUSTMENT'
        form.type = 'INCREASE'
    }

    const submitMovement = async () => {
        if (!productId.value) {
            toast.error('Selecciona un producto')
            return
        }
        if (!form.quantity || form.quantity <= 0) {
            toast.error('La cantidad debe ser mayor a 0')
            return
        }
        if (!form.reason.trim()) {
            toast.error('La razón es obligatoria')
            return
        }
        try {
            await mutateAsync({ productId: productId.value, body: { ...form } })
            toast.success('Movimiento aplicado')
        } catch (error: any) {
            const message = error?.response?.data?.message ?? 'Error aplicando movimiento'
            toast.error(message)
        }
    }

    return {
        productId,
        selectedProductId,
        productIdInput,
        inventory,
        movements,
        isLoading,
        movementsLoading,
        isMutating,
        form,
        applyProductId,
        applySelectedProduct,
        resetForm,
        submitMovement,
    }
}
