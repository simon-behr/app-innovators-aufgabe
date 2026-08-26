import * as z from 'zod'
import { ApiPageableSchema } from '#shared/schemas/ApiPageable'

export function createPageSchema<T extends z.ZodType>(contentSchema: T) {
  return z.object({
    content: z.array(contentSchema),
    pageable: ApiPageableSchema,
  })
}
