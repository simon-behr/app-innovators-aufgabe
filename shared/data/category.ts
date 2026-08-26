import { getTypedKeys } from '#shared/utils/getTypedKeys.ts'

// single source of truth
export const CATEGORY_LABELS = {
  electronics: 'Elektronik',
  books: 'Bücher',
  clothing: 'Kleidung',
  food: 'Lebensmittel',
  toys: 'Spielzeug',
} as const

export const CATEGORIES = getTypedKeys(CATEGORY_LABELS)
