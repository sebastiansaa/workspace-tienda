export function formatPrice(value: number | string | null | undefined, currency = 'USD') {
  const n = Number(value ?? 0)
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n)
  } catch (e) {
    return `${n} ${currency}`
  }
}
