// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { createValidProductPayload } from '~~/test/support/productFixtures'

describe('POST /api/product', async () => {
  await setup()

  it('creates a product and returns it with a generated id/createdAt', async () => {
    const product = await $fetch('/api/product', {
      method: 'POST',
      body: createValidProductPayload(),
    })

    expect(product.id).toBeTypeOf('string')
    expect(product.createdAt).toBeTypeOf('string')
    expect(product.price).toBe(2999)
  })

  it('ignores client-supplied id and createdAt', async () => {
    const product = await $fetch('/api/product', {
      method: 'POST',
      body: {
        ...createValidProductPayload(),
        id: 'client-supplied-id',
        createdAt: '2000-01-01T00:00:00.000Z',
      },
    })

    expect(product.id).not.toBe('client-supplied-id')
    expect(product.createdAt).not.toBe('2000-01-01T00:00:00.000Z')
  })

  it('rejects an invalid payload with a 400 validation error', async () => {
    await expect(
      $fetch('/api/product', {
        method: 'POST',
        body: createValidProductPayload({ name: '' }),
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})
