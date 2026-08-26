import type { Product } from '#shared/schemas/Product'
import { CreateProductSchema } from '#shared/schemas/Product'

export default defineEventHandler(async (event): Promise<Product> => {
  const { data, success, error } = CreateProductSchema.safeParse(await readBody(event))

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: error.issues,
    })
  }

  return addProduct({
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  })
})
