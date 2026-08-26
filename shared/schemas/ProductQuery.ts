import * as z from 'zod'
import { CategorySchema } from '#shared/schemas/Product'
import { AVAILABILITY_STATUSES } from '#shared/data/availability'

const availabilitySchema = z.enum(AVAILABILITY_STATUSES)

export const ProductQuerySchema = z.object({
  search: z.string().trim().optional(),

  // Query strings give a single string for one value and an array for repeated keys — normalize to an array
  category: z.preprocess(
    val => (val === undefined ? undefined : Array.isArray(val) ? val : [val]),
    z.array(CategorySchema).optional(),
  ),

  availability: availabilitySchema.optional(),

  pageIndex: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
})

export type Availability = z.infer<typeof availabilitySchema>
export type ProductQueryInput = z.input<typeof ProductQuerySchema>
