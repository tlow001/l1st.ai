import type { Product, ImageType } from '@/types'

// Mock product templates for AI extraction
const fridgeProducts: Omit<Product, 'id' | 'inShoppingList' | 'checkedOff'>[] = [
  {
    name: 'Whole Milk',
    category: 'Dairy',
    quantity: 1,
    unit: 'l',
    details: {
      price: '$3.99',
      nutritionalInfo: '150 cal per cup, 8g protein',
      notes: 'Check expiration date',
    },
  },
  {
    name: 'Cheddar Cheese',
    category: 'Dairy',
    quantity: 8,
    unit: 'oz',
    details: {
      price: '$5.49',
      nutritionalInfo: '110 cal per oz, 7g protein',
    },
  },
  {
    name: 'Large Eggs',
    category: 'Dairy',
    quantity: 1,
    unit: 'dozen',
    details: {
      price: '$4.29',
      nutritionalInfo: '70 cal per egg, 6g protein',
    },
  },
  {
    name: 'Butter',
    category: 'Dairy',
    quantity: 1,
    unit: 'lb',
    details: {
      price: '$4.99',
    },
  },
]

const receiptProducts: Omit<Product, 'id' | 'inShoppingList' | 'checkedOff'>[] = [
  {
    name: 'Sourdough Bread',
    category: 'Bakery',
    quantity: 1,
    unit: 'unit',
    details: {
      price: '$5.99',
    },
  },
  {
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: 2,
    unit: 'lb',
    details: {
      price: '$8.98',
      nutritionalInfo: '165 cal per 3.5oz, 31g protein',
    },
  },
  {
    name: 'Roma Tomatoes',
    category: 'Produce',
    quantity: 1.5,
    unit: 'lb',
    details: {
      price: '$2.99',
      nutritionalInfo: '18 cal per 100g',
    },
  },
  {
    name: 'Baby Spinach',
    category: 'Produce',
    quantity: 1,
    unit: 'package',
    details: {
      price: '$3.49',
      nutritionalInfo: '7 cal per cup',
    },
  },
  {
    name: 'Bananas',
    category: 'Produce',
    quantity: 1,
    unit: 'bunch',
    details: {
      price: '$1.99',
    },
  },
]

const recipeProducts: Omit<Product, 'id' | 'inShoppingList' | 'checkedOff'>[] = [
  {
    name: 'Penne Pasta',
    category: 'Pantry',
    quantity: 1,
    unit: 'lb',
    details: {
      price: '$2.49',
      nutritionalInfo: '200 cal per 2oz dry',
    },
  },
  {
    name: 'Extra Virgin Olive Oil',
    category: 'Pantry',
    quantity: 500,
    unit: 'ml',
    details: {
      price: '$12.99',
      nutritionalInfo: '120 cal per tbsp',
    },
  },
  {
    name: 'Garlic',
    category: 'Produce',
    quantity: 1,
    unit: 'unit',
    details: {
      price: '$0.79',
    },
  },
  {
    name: 'Parmesan Cheese',
    category: 'Dairy',
    quantity: 6,
    unit: 'oz',
    details: {
      price: '$6.99',
      nutritionalInfo: '110 cal per oz, 10g protein',
    },
  },
  {
    name: 'Fresh Basil',
    category: 'Produce',
    quantity: 1,
    unit: 'bunch',
    details: {
      price: '$2.99',
    },
  },
]

/**
 * Simulates AI extraction from uploaded images
 * AI automatically detects and extracts products from any image type
 */
export async function mockAIExtraction(): Promise<Omit<Product, 'id' | 'inShoppingList' | 'checkedOff'>[]> {
  // Simulate 2-second processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // For demo: return a random mix of products to simulate AI detection
  const allProducts = [...fridgeProducts, ...receiptProducts, ...recipeProducts]
  const numProducts = Math.floor(Math.random() * 5) + 3 // 3-7 products

  // Shuffle and take random products
  const shuffled = allProducts.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, numProducts)
}
