import { reactive, ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import type { AdminCategoryDTO, CreateCategoryDto, UpdateCategoryDto } from "../interfaces";
import { createAdminCategory, updateAdminCategory, deleteAdminCategory } from "../services";

export const useAdminCategoryCrud = () => {
  const queryClient = useQueryClient();

  const form = reactive<CreateCategoryDto & { id?: number }>({
    title: "",
    slug: "",
    image: "",
    description: "",
    active: true,
    sortOrder: 0,
  });

  const editingId = ref<number | null>(null);
  const isSaving = ref(false);

  const resetForm = () => {
    editingId.value = null;
    form.title = "";
    form.slug = "";
    form.image = "";
    form.description = "";
    form.active = true;
    form.sortOrder = 0;
  };

  const startEdit = (cat: AdminCategoryDTO) => {
    editingId.value = cat.id;
    form.title = cat.title;
    form.slug = cat.slug;
    form.image = cat.image ?? "";
    form.description = cat.description ?? "";
    form.active = cat.active;
    form.sortOrder = cat.sortOrder ?? 0;
  };

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  const submit = async () => {
    isSaving.value = true;
    try {
      if (editingId.value) {
        const payload: UpdateCategoryDto = {
          title: form.title,
          slug: form.slug,
          image: form.image || undefined,
          description: form.description || undefined,
          active: form.active,
          sortOrder: form.sortOrder,
        };
        await updateAdminCategory(editingId.value, payload);
      } else {
        const payload: CreateCategoryDto = {
          title: form.title,
          slug: form.slug,
          image: form.image || undefined,
          description: form.description || undefined,
          active: form.active,
          sortOrder: form.sortOrder,
        };
        await createAdminCategory(payload);
      }
      await invalidate();
      resetForm();
    } finally {
      isSaving.value = false;
    }
  };

  const remove = async (id: number) => {
    isSaving.value = true;
    try {
      await deleteAdminCategory(id);
      await invalidate();
      if (editingId.value === id) resetForm();
    } finally {
      isSaving.value = false;
    }
  };

  return {
    form,
    editingId,
    isSaving,
    resetForm,
    startEdit,
    submit,
    remove,
  };
};

export default useAdminCategoryCrud;
