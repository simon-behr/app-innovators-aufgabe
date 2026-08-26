import { faker } from '@faker-js/faker'
import type { Product } from '#shared/schemas/Product'
import { CATEGORIES } from '#shared/data/category'

export function generateSeedProducts(count = 200): Product[] {
  faker.seed(6767)

  return Array.from({ length: count }, () => {
    const createdAt = faker.date.past({ years: 2 }).toISOString()

    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: Math.round(Number(faker.commerce.price({ min: 1, max: 500 })) * 100),
      category: faker.helpers.arrayElement(CATEGORIES),
      stock: faker.number.int({ min: 0, max: 200 }),
      tags: faker.helpers.multiple(
        () => faker.commerce.productAdjective().toLowerCase(),
        { count: { min: 0, max: 3 } },
      ),
      createdAt,
    }
  })
}
