export type ProductCategory = 
  | 'Fresh Produce'
  | 'Meat & Seafood'
  | 'Dairy & Eggs'
  | 'Bakery & Bread'
  | 'Frozen Foods'
  | 'Pantry & Dry Goods'
  | 'Canned & Jarred Foods'
  | 'Snacks & Chips'
  | 'Candy & Chocolate'
  | 'Beverages'
  | 'Wine & Spirits'
  | 'Breakfast & Cereals'
  | 'Deli & Prepared Foods'
  | 'Condiments & Sauces'
  | 'Baking Supplies'
  | 'Health & Wellness'
  | 'Baby Products'
  | 'Pet Supplies'
  | 'Personal Care & Beauty'
  | 'Household & Cleaning'
  | 'Kitchen & Dining'
  | 'Home & Garden'

export type Unit = 'lb' | 'oz' | 'kg' | 'g' | 'ml' | 'l' | 'unit' | 'dozen' | 'bunch' | 'package'

export type ImageSource = 'fridge' | 'product' | 'shopping_list' | 'dish' | 'recipe' | 'voice'

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
  source?: ImageSource
  inShoppingList: boolean
  checkedOff: boolean
  checkOffOrder?: number
  imageUrl?: string
  imageStoragePath?: string // Firebase Storage path for cleanup
  details?: ProductDetails
  createdAt?: any // Firestore Timestamp
  updatedAt?: any // Firestore Timestamp
  order?: number // For custom ordering
}

export type ImageType = 'fridge' | 'product' | 'shopping_list' | 'dish' | 'recipe'

export interface ImageValidationResponse {
  valid: boolean
  message: string
  products: Omit<Product, 'id' | 'inShoppingList' | 'checkedOff'>[]
}

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
  location?: string
  startTime?: string
  products: ShoppingTripProduct[]
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export type SharingStatus = 'none' | 'pending' | 'accepted'

export interface SharingConfig {
  collaboratorId: string | null
  collaboratorEmail: string | null
  collaboratorName: string | null
  invitedAt: any // Firestore Timestamp
  acceptedAt: any | null
  status: SharingStatus
}

export interface SharedListAccess {
  ownerId: string
  ownerEmail: string
  ownerName: string
  accessGrantedAt: any // Firestore Timestamp
  lastActivity: any // Firestore Timestamp
  status?: SharingStatus // Optional for backwards compatibility
}

export interface AppState {
  products: Product[]
  picklistProducts: Product[] // Separate array for user's own picklist (always stays on user's list)
  uploadedImages: UploadedImage[]
  shoppingTrips: ShoppingTrip[]
  credits: number
  isShopMode: boolean
  user: User | null
  isAuthenticated: boolean
  // Sharing state
  sharingConfig: SharingConfig | null
  sharedListsAccess: SharedListAccess[]
  activeListOwnerId: string | null // null = my list, otherwise owner's ID
  // Loading states
  isLoading: boolean
  productsLoading: boolean
  tripsLoading: boolean
  creditsLoading: boolean
  sharingLoading: boolean
  // Error states
  error: string | null
}

export interface AppActions {
  addProduct: (product: Omit<Product, 'id' | 'inShoppingList' | 'checkedOff'>) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  toggleProductInList: (id: string) => Promise<void>
  // Picklist-specific actions (always use user's own ID)
  addProductToPicklist: (product: Omit<Product, 'id' | 'inShoppingList' | 'checkedOff'>) => Promise<void>
  updateProductInPicklist: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProductFromPicklist: (id: string) => Promise<void>
  toggleProductInPicklist: (id: string) => Promise<void>
  clearAllPicklistProducts: () => Promise<void>
  checkOffProduct: (id: string) => Promise<void>
  addImage: (image: UploadedImage) => void
  removeImage: (id: string) => void
  addShoppingTrip: (trip: ShoppingTrip) => Promise<void>
  useCredits: (amount: number) => Promise<boolean>
  setShopMode: (isShopMode: boolean) => void
  clearCheckedProducts: () => Promise<void>
  reorderProducts: (products: Product[]) => Promise<void>
  clearAllProducts: () => Promise<void>
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => boolean
  // Sharing actions
  inviteCollaborator: (email: string) => Promise<{ success: boolean; error?: string }>
  removeCollaborator: () => Promise<void>
  acceptSharedList: (ownerId: string) => Promise<void>
  declineSharedList: (ownerId: string) => Promise<void>
  switchToList: (ownerId: string | null) => void // null = my list
  getActiveListOwner: () => { id: string; name: string; email: string } | null
}
