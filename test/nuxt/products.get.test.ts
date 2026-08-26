// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('GET /api/products', async () => {
  await setup()

  it('returns the first page with default pagination metadata', async () => {
    const page = await $fetch('/api/products')

    expect(page.pageable.pageIndex).toBe(0)
    expect(page.pageable.pageSize).toBe(25)
    expect(page.content).toHaveLength(25)
    expect(page.pageable.totalElements).toBeGreaterThan(page.content.length)
  })

  it('filters by category and only returns matching products', async () => {
    const page = await $fetch('/api/products', { query: { category: 'books', pageSize: 100 } })

    expect(page.content.length).toBeGreaterThan(0)
    expect(page.content.every(product => product.category === 'books')).toBe(true)
  })

  it('rejects an invalid pagination query', async () => {
    await expect(
      $fetch('/api/products', { query: { pageSize: 0 } }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('respects pageSize and returns disjoint items across consecutive pages', async () => {
    const pageSize = 10
    const [firstPage, secondPage] = await Promise.all([
      $fetch('/api/products', { query: { pageIndex: 0, pageSize } }),
      $fetch('/api/products', { query: { pageIndex: 1, pageSize } }),
    ])

    expect(firstPage.content).toHaveLength(pageSize)
    expect(secondPage.content).toHaveLength(pageSize)
    expect(secondPage.pageable.pageIndex).toBe(1)

    const firstPageIds = new Set(firstPage.content.map(product => product.id))
    expect(secondPage.content.every(product => !firstPageIds.has(product.id))).toBe(true)
  })
})
