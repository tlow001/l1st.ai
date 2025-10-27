import type { Product, ShoppingTrip } from '@/types'

/**
 * Checks if two locations are similar (within ~100m)
 * Coordinates are in degrees, roughly 0.001° = 100m
 */
function isSimilarLocation(loc1: string, loc2: string): boolean {
  // Extract coordinates from format like "50.8503°, 4.3517°"
  const extractCoords = (loc: string) => {
    const match = loc.match(/([\d.]+)°,\s*([\d.]+)°/)
    if (!match) return null
    return { lat: parseFloat(match[1]), lon: parseFloat(match[2]) }
  }

  const coords1 = extractCoords(loc1)
  const coords2 = extractCoords(loc2)

  if (!coords1 || !coords2) return false

  // Check if within ~0.001 degrees (roughly 100m)
  const latDiff = Math.abs(coords1.lat - coords2.lat)
  const lonDiff = Math.abs(coords1.lon - coords2.lon)

  return latDiff < 0.001 && lonDiff < 0.001
}

/**
 * Calculates the average check-off order for a product across shopping trips
 * Optionally filters by location to learn location-specific patterns
 */
function getAverageCheckOffOrder(
  productId: string, 
  trips: ShoppingTrip[],
  currentLocation?: string
): number | null {
  // Filter trips by location if provided
  let relevantTrips = trips.filter((trip) =>
    trip.products.some((p) => p.id === productId)
  )

  // If location provided, prioritize trips from same location
  if (currentLocation && relevantTrips.length > 0) {
    const locationSpecificTrips = relevantTrips.filter(
      (trip) => trip.location && isSimilarLocation(trip.location, currentLocation)
    )
    
    // Use location-specific trips if we have at least 2
    if (locationSpecificTrips.length >= 2) {
      relevantTrips = locationSpecificTrips
    }
  }

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
 * Optionally considers location to provide location-specific ordering
 */
export function sortByLearningAlgorithm(
  products: Product[],
  trips: ShoppingTrip[],
  currentLocation?: string
): Product[] {
  // Need at least 2 trips to start learning
  if (trips.length < 2) {
    return products
  }

  // Calculate average order for each product (location-aware if location provided)
  const productsWithScores = products.map((product) => ({
    product,
    averageOrder: getAverageCheckOffOrder(product.id, trips, currentLocation),
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
