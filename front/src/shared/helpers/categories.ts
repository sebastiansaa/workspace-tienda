// src/shared/helpers/categories.ts

export const categories = [
  { key: 'clothes', label: 'Ropa' },
  { key: 'electronics', label: 'Electrónica' },
  { key: 'furniture', label: 'Muebles' },
  { key: 'shoes', label: 'Calzado' },
  { key: 'miscellaneous', label: 'Varios' },
]

// Helper para traducir una key de la API
export function getCategoryLabel(key: string): string {
  const category = categories.find(category => category.key === key)
  return category ? category.label : key
}
