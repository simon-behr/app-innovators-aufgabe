import type { PageOfProduct } from '#shared/schemas/PageOfProduct'
import { ProductQuerySchema } from '#shared/schemas/ProductQuery'

export default defineEventHandler((event): PageOfProduct => {
  const { data: query, success, error } = ProductQuerySchema.safeParse(getQuery(event))

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameters',
      data: error.issues,
    })
  }

  const { search, category, availability, pageIndex, pageSize } = query

  let items = getAllProducts()

  if (search) {
    const q = search.trim().toLowerCase()
    items = items.filter(
      p =>
        p.name.toLowerCase().includes(q)
        || (p.description?.toLowerCase().includes(q) ?? false)
        || p.tags.some(tag => tag.toLowerCase().includes(q)),
    )
  }

  if (category?.length) {
    items = items.filter(p => category.includes(p.category))
  }

  if (availability && availability !== 'all') {
    items = items.filter(p => getAvailabilityStatus(p.stock) === availability)
  }

  const sortedItems = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalElements = sortedItems.length
  const start = pageIndex * pageSize
  const paginated = sortedItems.slice(start, start + pageSize)

  return {
    content: paginated,
    pageable: {
      totalElements,
      pageIndex,
      pageSize,
      totalPages: Math.ceil(totalElements / pageSize),
    },
  }
})
