import * as z from 'zod'
import { CATEGORIES } from '#shared/data/category'

export const CategorySchema = z.enum(CATEGORIES, 'Kategorie ist erforderlich.')

export const ProductSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1, 'Name ist erforderlich.').max(120),
  description: z.string().trim().max(2000, 'Maximal 2000 Zeichen.').optional(),
  price: z.number().int().min(0),
  category: CategorySchema,
  stock: z.number('Bestand ist erforderlich.').int().min(0),
  tags: z.array(z.string().trim().toLowerCase().min(1)).default([]),
  createdAt: z.iso.datetime(),
})

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
}).extend({
  price: z.number('Preis ist erforderlich.').min(0, 'Preis darf nicht negativ sein'),
}).transform(({ price, ...rest }) => ({
  ...rest,
  price: Math.round(price * 100),
}))

export type Product = z.infer<typeof ProductSchema>
export type CreateProductInput = z.input<typeof CreateProductSchema>
export type Category = z.infer<typeof CategorySchema>
