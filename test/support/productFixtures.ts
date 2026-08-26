import type { CreateProductInput } from '#shared/schemas/Product'

export function createValidProductPayload(overrides: Partial<CreateProductInput> = {}): CreateProductInput {
  return {
    name: '     Wireless Mouse  ',
    description: 'Ergonomische kabellose Maus',
    price: 29.99,
    category: 'electronics',
    stock: 15,
    tags: ['Office', 'Wireless'],
    ...overrides,
  }
}
