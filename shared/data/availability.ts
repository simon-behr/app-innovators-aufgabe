// single source of truth
export const AVAILABILITY_LABELS = {
  all: 'Alle',
  inStock: 'Auf Lager',
  lowStock: 'Niedriger Bestand',
  outOfStock: 'Nicht verfügbar',
} as const

export const AVAILABILITY_STATUSES = getTypedKeys(AVAILABILITY_LABELS)
