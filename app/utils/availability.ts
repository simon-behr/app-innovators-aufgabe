import type { BadgeProps } from '@nuxt/ui'
import type { Availability } from '#shared/schemas/ProductQuery'
import { AVAILABILITY_LABELS } from '#shared/data/availability'

const AVAILABILITY_COLOR = {
  all: 'neutral',
  inStock: 'success',
  lowStock: 'warning',
  outOfStock: 'error',
} as const satisfies Record<Availability, BadgeProps['color']>

export function getAvailabilityText(status: Availability): string {
  return AVAILABILITY_LABELS[status]
}

export function getAvailabilityColor(status: Availability): BadgeProps['color'] {
  return AVAILABILITY_COLOR[status]
}
