import type { Product } from '#shared/schemas/Product.ts'

// array instead of useStorage composable to keep it simple
const products: Product[] = generateSeedProducts()

export function getAllProducts() {
  return products
}

export function addProduct(product: Product) {
  products.push(product)
  return product
}
