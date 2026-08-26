import type * as z from 'zod'
import { createPageSchema } from '#shared/schemas/Page'
import { ProductSchema } from '#shared/schemas/Product'

export const PageOfProductSchema = createPageSchema(ProductSchema)

export type PageOfProduct = z.infer<typeof PageOfProductSchema>
