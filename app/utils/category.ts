import type { Category } from '#shared/schemas/Product'
import type { BadgeProps } from '@nuxt/ui'
import { CATEGORY_LABELS } from '#shared/data/category'

const CATEGORY_COLOR = {
  electronics: 'info',
  books: 'primary',
  clothing: 'success',
  food: 'warning',
  toys: 'error',
} as const satisfies Record<Category, BadgeProps['color']>

export function getCategoryText(category: Category): string {
  return CATEGORY_LABELS[category]
}

export function getCategoryColor(category: Category): BadgeProps['color'] {
  return CATEGORY_COLOR[category]
}
