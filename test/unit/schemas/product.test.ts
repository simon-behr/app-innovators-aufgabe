// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createValidProductPayload } from '~~/test/support/productFixtures'
import { CreateProductSchema } from '#shared/schemas/Product'

describe('CreateProductSchema', () => {
  it('parses a valid payload and trims and normalizes price (cents) and tags (lowercase)', () => {
    const result = CreateProductSchema.safeParse(createValidProductPayload())

    expect(result.success).toBe(true)
    expect(result.data?.name).toBe('Wireless Mouse')
    expect(result.data?.price).toBe(2999)
    expect(result.data?.tags).toEqual(['office', 'wireless'])
  })

  it('rejects an empty name with error message', () => {
    const result = CreateProductSchema.safeParse(createValidProductPayload({ name: '' }))

    expect(result.success).toBe(false)
    expect(result.error?.issues).toContainEqual(
      expect.objectContaining({ path: ['name'], message: 'Name ist erforderlich.' }),
    )
  })

  it('rejects a category outside the allowed enum', () => {
    // @ts-expect-error using category outside enum on purpose
    const result = CreateProductSchema.safeParse(createValidProductPayload({ category: 'furniture' }))

    expect(result.success).toBe(false)
  })

  it('rejects a negative stock', () => {
    const result = CreateProductSchema.safeParse(createValidProductPayload({ stock: -1 }))

    expect(result.success).toBe(false)
  })
})
