<template>
  <span :class="['admin-status-badge', colorClass]">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ status: string }>()

const colorClass = computed(() => {
  const s = props.status.toLowerCase()
  if (
    s.includes('paid') ||
    s.includes('authorized') ||
    s.includes('active') ||
    s.includes('shipped') ||
    s.includes('completed')
  )
    return 'is-success'
  if (s.includes('pending')) return 'is-pending'
  if (
    s.includes('failed') ||
    s.includes('canceled') ||
    s.includes('suspended') ||
    s.includes('deleted')
  )
    return 'is-danger'
  return 'is-neutral'
})

const label = computed(() => props.status)
</script>

<style scoped>
.admin-status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border: 1px solid transparent;
}
.is-success {
  background: #e6f9ed;
  color: #0f9157;
  border-color: #b3eacb;
}
.is-pending {
  background: #fff7e6;
  color: #c77d00;
  border-color: #ffe0a3;
}
.is-danger {
  background: #fde8e8;
  color: #c81e1e;
  border-color: #f9c2c2;
}
.is-neutral {
  background: #f1f5f9;
  color: #334155;
  border-color: #e2e8f0;
}
</style>
