import type { Availability } from '#shared/schemas/ProductQuery'

const LOW_STOCK_THRESHOLD = 10

export function getAvailabilityStatus(stock: number): Exclude<Availability, 'all'> {
  if (stock === 0) return 'outOfStock'
  if (stock <= LOW_STOCK_THRESHOLD) return 'lowStock'
  return 'inStock'
}
