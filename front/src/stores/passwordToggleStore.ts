// Store para manejar el estado de visibilidad de contraseñas.
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePasswordToggleStore = defineStore('passwordToggle', () => {
  const isVisible = ref<boolean>(false);

  const toggleVisibility = (): void => {
    isVisible.value = !isVisible.value;
  };

  const setVisibility = (value: boolean): void => {
    isVisible.value = value;
  };

  return {
    isVisible,
    toggleVisibility,
    setVisibility,
  };
}, {
  persist: {
    key: 'password-visible',
    storage: localStorage,
  },
});
