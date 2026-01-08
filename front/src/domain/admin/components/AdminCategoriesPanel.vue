<template>
  <section class="categories">
    <header class="categories__header">
      <div>
        <h2>Categorías</h2>
        <p class="categories__subtitle">
          Crea, edita y elimina categorías que luego asignas a productos.
        </p>
      </div>
      <button class="btn" type="button" @click="resetForm">Nueva categoría</button>
    </header>

    <div class="categories__grid">
      <AdminCategoryForm
        :form="form"
        :editing-id="editingId"
        :is-saving="isSaving"
        @submit="handleSubmit"
        @reset="resetForm"
      />

      <AdminCategoryList
        :categories="categories"
        :is-loading="isLoading"
        :is-fetching="isFetching"
        :is-saving="isSaving"
        @edit="startEdit"
        @delete="handleDelete"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAdminCategories } from '../composables'
import { useAdminCategoryCrud } from '../composables/useAdminCategoryCrud'
import { AdminCategoryForm, AdminCategoryList } from '../components'

const { categories, isLoading, isFetching } = useAdminCategories()
const { form, editingId, isSaving, resetForm, startEdit, submit, remove } = useAdminCategoryCrud()

const handleSubmit = () => submit()
const handleDelete = (id: number) => {
  if (!confirm('¿Eliminar esta categoría?')) return
  return remove(id)
}
</script>

<style scoped>
.categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.categories__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.categories__subtitle {
  margin: 4px 0 0;
  color: #475569;
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
}

.card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  padding: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form__row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form__row--inline {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.form__row input,
.form__row textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.form__actions {
  display: flex;
  gap: 8px;
}

.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #0f172a;
  background: #0f172a;
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--ghost {
  border-color: #cbd5e1;
  background: #fff;
  color: #0f172a;
}

.btn--danger {
  border-color: #dc2626;
  background: #ef4444;
  color: #fff;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list__items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.list__title {
  font-weight: 600;
}

.list__subtitle {
  font-size: 13px;
  color: #475569;
}

.list__actions {
  display: flex;
  gap: 8px;
}

.list__empty {
  padding: 12px;
  color: #475569;
}

.pill {
  padding: 4px 8px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #0f172a;
  font-size: 12px;
}

.pill--loading {
  background: #cbd5e1;
}
</style>
