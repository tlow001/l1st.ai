import type { Product, ShoppingTrip } from '@/types'

/**
 * Calculates the average check-off order for a product across all shopping trips
 */
function getAverageCheckOffOrder(productId: string, trips: ShoppingTrip[]): number | null {
  const relevantTrips = trips.filter((trip) =>
    trip.products.some((p) => p.id === productId)
  )

  if (relevantTrips.length === 0) return null

  const totalOrder = relevantTrips.reduce((sum, trip) => {
    const product = trip.products.find((p) => p.id === productId)
    return sum + (product?.checkOffOrder || 0)
  }, 0)

  return totalOrder / relevantTrips.length
}

/**
 * Sorts products based on learned shopping patterns
 * Products with history are sorted by average check-off order
 * Products without history appear at the end
 */
export function sortByLearningAlgorithm(
  products: Product[],
  trips: ShoppingTrip[]
): Product[] {
  // Need at least 2 trips to start learning
  if (trips.length < 2) {
    return products
  }

  // Calculate average order for each product
  const productsWithScores = products.map((product) => ({
    product,
    averageOrder: getAverageCheckOffOrder(product.id, trips),
  }))

  // Sort: products with history first (by order), then products without history
  return productsWithScores
    .sort((a, b) => {
      // Both have history - sort by average order
      if (a.averageOrder !== null && b.averageOrder !== null) {
        return a.averageOrder - b.averageOrder
      }
      // Only a has history - a comes first
      if (a.averageOrder !== null) return -1
      // Only b has history - b comes first
      if (b.averageOrder !== null) return 1
      // Neither has history - maintain original order
      return 0
    })
    .map((item) => item.product)
}

/**
 * Checks if the learning algorithm is active (requires 2+ trips)
 */
export function isLearningActive(trips: ShoppingTrip[]): boolean {
  return trips.length >= 2
}
