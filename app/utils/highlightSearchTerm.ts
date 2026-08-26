function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#39;')
}

export function highlightSearchTerm(text: string | undefined, searchTerm: string): string {
  if (!text) return ''

  const escapedText = escapeHtml(text)
  if (!searchTerm) return escapedText

  const escapedTerm = searchTerm.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
  return escapedText.replaceAll(new RegExp(escapedTerm, 'gi'), match => `<mark>${match}</mark>`)
}
