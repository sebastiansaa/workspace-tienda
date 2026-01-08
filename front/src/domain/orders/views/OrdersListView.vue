<template>
  <OrdersList :orders="orders" :showSuccess="store.showSuccess" />
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import type { Order } from '../interfaces/types'
import { useRoute } from 'vue-router'
import OrdersList from '../components/OrdersList.vue'
import { useOrders } from '../composables/useOrders'
import { useOrdersStore } from '../stores/ordersStore'

const route = useRoute()
const store = useOrdersStore()
const { orders, refetch, watchSuccess } = useOrders()

onMounted(() => {
  void refetch()
  if (route.query.success === 'true') {
    store.setShowSuccess(true)
    watchSuccess()
  }
})
</script>
