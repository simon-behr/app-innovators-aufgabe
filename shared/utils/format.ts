const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })
const dateFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' })

export function formatPrice(priceInCents: number): string {
  return currencyFormatter.format(priceInCents / 100)
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}
