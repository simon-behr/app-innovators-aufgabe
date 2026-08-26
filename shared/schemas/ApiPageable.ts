import * as z from 'zod'

export const ApiPageableSchema = z.object({
  totalElements: z.number().int().min(0),
  pageIndex: z.number().int().min(0),
  pageSize: z.number().int().min(1),
  totalPages: z.number().int().min(0),
})

export type ApiPageable = z.infer<typeof ApiPageableSchema>
