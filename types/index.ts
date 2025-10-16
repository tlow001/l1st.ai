export type ProductCategory = 'Dairy' | 'Bakery' | 'Meat' | 'Produce' | 'Pantry' | 'Other'

export type Unit = 'lb' | 'oz' | 'kg' | 'g' | 'ml' | 'l' | 'unit' | 'dozen' | 'bunch' | 'package'

export interface ProductDetails {
  price?: string
  nutritionalInfo?: string
  alternatives?: string[]
  notes?: string
}

export interface Product {
  id: string
  name: string
  category: ProductCategory
  quantity: number
  unit: Unit
  inShoppingList: boolean
  checkedOff: boolean
  checkOffOrder?: number
  imageUrl?: string
  details?: ProductDetails
}

export type ImageType = 'fridge' | 'receipt' | 'recipe'

export interface UploadedImage {
  id: string
  file: File
  preview: string
  type?: ImageType
  processed: boolean
}

export interface ShoppingTripProduct {
  id: string
  checkOffOrder: number
}

export interface ShoppingTrip {
  id: string
  date: string
  products: ShoppingTripProduct[]
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AppState {
  products: Product[]
  uploadedImages: UploadedImage[]
  shoppingTrips: ShoppingTrip[]
  credits: number
  isShopMode: boolean
  user: User | null
  isAuthenticated: boolean
}

export interface AppActions {
  addProduct: (product: Omit<Product, 'id' | 'inShoppingList' | 'checkedOff'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  toggleProductInList: (id: string) => void
  checkOffProduct: (id: string) => void
  addImage: (image: UploadedImage) => void
  removeImage: (id: string) => void
  addShoppingTrip: (trip: ShoppingTrip) => void
  useCredits: (amount: number) => boolean
  setShopMode: (isShopMode: boolean) => void
  clearCheckedProducts: () => void
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => boolean
}
