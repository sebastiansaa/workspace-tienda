/* Gestiona el estado global de navegación de la aplicación. Permite:
 * Guardar la categoría seleccionada (selectedCategory) para resaltar la categoría activa en el nav.
 * Controlar la sección actual (currentSection) para navegación interna.
 * Manejar la apertura/cierre del menú de categorías (isNavCatOpen).
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNavStore = defineStore('nav', () => {

  const selectedCategory = ref<number | null>(null)
  const currentSection = ref<string | null>(null)
  const isNavCatOpen = ref<boolean>(false)

  const setCategory = (categoryId: number | null) => {
    selectedCategory.value = categoryId
  }

  const setCurrentSection = (section: string | null) => {
    currentSection.value = section
  }

  const toggleNavCat = () => {
    isNavCatOpen.value = !isNavCatOpen.value
  }

  const openNavCat = () => {
    isNavCatOpen.value = true
  }

  const closeNavCat = () => {
    isNavCatOpen.value = false
  }

  return {
    selectedCategory,
    currentSection,
    isNavCatOpen,

    setCategory,
    setCurrentSection,
    toggleNavCat,
    openNavCat,
    closeNavCat,
  }

});
