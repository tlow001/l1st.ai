import { create } from 'zustand'
import type { AppState, AppActions, Product, UploadedImage, ShoppingTrip } from '@/types'
import { signInWithEmail, registerWithEmail, signInWithGoogle, signOut as firebaseSignOut } from '@/lib/firebaseAuth'
import * as firestoreOps from '@/lib/firestoreOperations'
import type { Unsubscribe } from 'firebase/firestore'

type Store = AppState & AppActions & {
  initializeFirestore: (userId: string) => void
  cleanupFirestore: () => void
}

// Store unsubscribe functions
let unsubscribeProducts: Unsubscribe | null = null
let unsubscribePicklistProducts: Unsubscribe | null = null // Separate subscription for picklist
let unsubscribeTrips: Unsubscribe | null = null
let unsubscribeCredits: Unsubscribe | null = null
let unsubscribeSharing: Unsubscribe | null = null
let unsubscribeSharedAccess: Unsubscribe | null = null

export const useStore = create<Store>()((set, get) => ({
  // Initial state
  products: [],
  picklistProducts: [], // Separate array for user's own picklist products
  uploadedImages: [],
  shoppingTrips: [],
  credits: 100,
  isShopMode: false,
  user: null,
  isAuthenticated: false,
  // Sharing state
  sharingConfig: null,
  sharedListsAccess: [],
  activeListOwnerId: null,
  // Loading states
  isLoading: false,
  productsLoading: false,
  tripsLoading: false,
  creditsLoading: false,
  sharingLoading: false,
  // Error states
  error: null,

  // Firestore initialization
  initializeFirestore: (userId: string) => {
    set({ isLoading: true, productsLoading: true, tripsLoading: true, creditsLoading: true, sharingLoading: true })

    // Subscribe to products (will be for active list)
    unsubscribeProducts = firestoreOps.subscribeToProducts(userId, (products) => {
      set({ products, productsLoading: false })
    })

    // ALWAYS subscribe to user's own products for picklist (separate subscription)
    unsubscribePicklistProducts = firestoreOps.subscribeToProducts(userId, (picklistProducts) => {
      set({ picklistProducts })
    })

    // Subscribe to shopping trips
    unsubscribeTrips = firestoreOps.subscribeToShoppingTrips(userId, (trips) => {
      set({ shoppingTrips: trips, tripsLoading: false })
    })

    // Subscribe to credits
    unsubscribeCredits = firestoreOps.subscribeToCredits(userId, (credits) => {
      set({ credits, creditsLoading: false })
    })

    // Subscribe to sharing config (my collaborator)
    unsubscribeSharing = firestoreOps.subscribeToSharingConfig(userId, (config) => {
      set({ sharingConfig: config, sharingLoading: false })
    })

    // Subscribe to shared access (lists shared WITH me)
    unsubscribeSharedAccess = firestoreOps.subscribeToSharedAccess(userId, (lists) => {
      set({ sharedListsAccess: lists })
    })

    set({ isLoading: false })
  },

  cleanupFirestore: () => {
    if (unsubscribeProducts) {
      unsubscribeProducts()
      unsubscribeProducts = null
    }
    if (unsubscribePicklistProducts) {
      unsubscribePicklistProducts()
      unsubscribePicklistProducts = null
    }
    if (unsubscribeTrips) {
      unsubscribeTrips()
      unsubscribeTrips = null
    }
    if (unsubscribeCredits) {
      unsubscribeCredits()
      unsubscribeCredits = null
    }
    if (unsubscribeSharing) {
      unsubscribeSharing()
      unsubscribeSharing = null
    }
    if (unsubscribeSharedAccess) {
      unsubscribeSharedAccess()
      unsubscribeSharedAccess = null
    }
    // Reset state
    set({
      products: [],
      picklistProducts: [],
      shoppingTrips: [],
      credits: 100,
      sharingConfig: null,
      sharedListsAccess: [],
      activeListOwnerId: null,
      isLoading: false,
      productsLoading: false,
      tripsLoading: false,
      creditsLoading: false,
      sharingLoading: false,
    })
  },

  // Product actions - now use Firestore
  addProduct: async (productData) => {
    const state = get()
    if (!state.user) return

    // Determine which user's list to add to
    const targetUserId = state.activeListOwnerId || state.user.id

    try {
      await firestoreOps.addProduct(targetUserId, productData)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error adding product:', error)
      set({ error: 'Failed to add product' })
    }
  },

  // PICKLIST-SPECIFIC ACTIONS (Always use user's own ID)
  // These ensure the picklist remains personal even when viewing shared lists
  addProductToPicklist: async (productData) => {
    const state = get()
    if (!state.user) return

    try {
      // ALWAYS use user's own ID for picklist operations
      await firestoreOps.addProduct(state.user.id, productData)
    } catch (error) {
      console.error('Error adding product to picklist:', error)
      set({ error: 'Failed to add product' })
    }
  },

  updateProductInPicklist: async (id, updates) => {
    const state = get()
    if (!state.user) return

    try {
      // ALWAYS use user's own ID for picklist operations
      await firestoreOps.updateProduct(state.user.id, id, updates)
    } catch (error) {
      console.error('Error updating product in picklist:', error)
      set({ error: 'Failed to update product' })
    }
  },

  deleteProductFromPicklist: async (id) => {
    const state = get()
    if (!state.user) return

    try {
      // ALWAYS use user's own ID for picklist operations
      await firestoreOps.deleteProduct(state.user.id, id)
    } catch (error) {
      console.error('Error deleting product from picklist:', error)
      set({ error: 'Failed to delete product' })
    }
  },

  toggleProductInPicklist: async (id) => {
    const state = get()
    if (!state.user) return

    try {
      // ALWAYS use user's own ID for picklist operations
      await firestoreOps.toggleProductInList(state.user.id, id)
    } catch (error) {
      console.error('Error toggling product in picklist:', error)
      set({ error: 'Failed to toggle product' })
    }
  },

  clearAllPicklistProducts: async () => {
    const state = get()
    if (!state.user) return

    try {
      // ALWAYS use user's own ID for picklist operations
      await firestoreOps.clearAllProducts(state.user.id)
    } catch (error) {
      console.error('Error clearing picklist products:', error)
      set({ error: 'Failed to clear all products' })
    }
  },

  updateProduct: async (id, updates) => {
    const state = get()
    if (!state.user) return

    const targetUserId = state.activeListOwnerId || state.user.id

    try {
      await firestoreOps.updateProduct(targetUserId, id, updates)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error updating product:', error)
      set({ error: 'Failed to update product' })
    }
  },

  deleteProduct: async (id) => {
    const state = get()
    if (!state.user) return

    const targetUserId = state.activeListOwnerId || state.user.id

    try {
      await firestoreOps.deleteProduct(targetUserId, id)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error deleting product:', error)
      set({ error: 'Failed to delete product' })
    }
  },

  toggleProductInList: async (id) => {
    const state = get()
    if (!state.user) return

    const targetUserId = state.activeListOwnerId || state.user.id

    try {
      await firestoreOps.toggleProductInList(targetUserId, id)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error toggling product:', error)
      set({ error: 'Failed to toggle product' })
    }
  },

  checkOffProduct: async (id) => {
    const state = get()
    if (!state.user) return

    const targetUserId = state.activeListOwnerId || state.user.id
    const checkedProducts = state.products.filter((p) => p.checkedOff).length

    try {
      await firestoreOps.checkOffProduct(targetUserId, id, checkedProducts + 1)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error checking off product:', error)
      set({ error: 'Failed to check off product' })
    }
  },

  clearCheckedProducts: async () => {
    const state = get()
    if (!state.user) return

    const targetUserId = state.activeListOwnerId || state.user.id

    try {
      await firestoreOps.clearCheckedProducts(targetUserId)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error clearing checked products:', error)
      set({ error: 'Failed to clear checked products' })
    }
  },

  reorderProducts: async (reorderedProducts) => {
    const state = get()
    if (!state.user) return

    const targetUserId = state.activeListOwnerId || state.user.id

    try {
      await firestoreOps.reorderProducts(targetUserId, reorderedProducts)
      // Update local state immediately for smooth UX
      set({ products: reorderedProducts })
    } catch (error) {
      console.error('Error reordering products:', error)
      set({ error: 'Failed to reorder products' })
    }
  },

  clearAllProducts: async () => {
    const state = get()
    if (!state.user) return

    const targetUserId = state.activeListOwnerId || state.user.id

    try {
      await firestoreOps.clearAllProducts(targetUserId)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error clearing all products:', error)
      set({ error: 'Failed to clear all products' })
    }
  },

  // Image actions (local only)
  addImage: (image) => {
    set((state) => ({
      uploadedImages: [...state.uploadedImages, image],
    }))
  },

  removeImage: (id) => {
    set((state) => ({
      uploadedImages: state.uploadedImages.filter((img) => img.id !== id),
    }))
  },

  // Shopping trip actions
  addShoppingTrip: async (trip) => {
    const state = get()
    if (!state.user) return

    try {
      await firestoreOps.addShoppingTrip(state.user.id, trip)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error adding shopping trip:', error)
      set({ error: 'Failed to add shopping trip' })
    }
  },

  // Credits actions
  useCredits: async (amount) => {
    const state = get()
    if (!state.user) return false

    try {
      const success = await firestoreOps.useCredits(state.user.id, amount)
      // Real-time listener will update the credits
      return success
    } catch (error) {
      console.error('Error using credits:', error)
      set({ error: 'Failed to use credits' })
      return false
    }
  },

  setShopMode: (isShopMode) => {
    set({ isShopMode })
  },

  // Auth actions
  login: async (email, password) => {
    try {
      const user = await signInWithEmail(email, password)
      if (user) {
        set({ user, isAuthenticated: true })
        // Initialize Firestore listeners
        get().initializeFirestore(user.id)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      set({ error: 'Login failed' })
      throw error
    }
  },

  loginWithGoogle: async () => {
    try {
      const user = await signInWithGoogle()
      if (user) {
        set({ user, isAuthenticated: true })
        // Initialize Firestore listeners
        get().initializeFirestore(user.id)
        return true
      }
      return false
    } catch (error) {
      console.error('Google login error:', error)
      set({ error: 'Google login failed' })
      throw error
    }
  },

  register: async (email, password, name) => {
    try {
      const user = await registerWithEmail(email, password, name)
      if (user) {
        set({ user, isAuthenticated: true })
        // Initialize Firestore listeners
        get().initializeFirestore(user.id)
        return true
      }
      return false
    } catch (error) {
      console.error('Register error:', error)
      set({ error: 'Registration failed' })
      throw error
    }
  },

  logout: async () => {
    try {
      // Clean up Firestore listeners
      get().cleanupFirestore()
      await firebaseSignOut()
      set({ user: null, isAuthenticated: false, error: null })
    } catch (error) {
      console.error('Logout error:', error)
      set({ error: 'Logout failed' })
      throw error
    }
  },

  checkAuth: () => {
    const state = get()
    return state.isAuthenticated && state.user !== null
  },

  // Sharing actions
  inviteCollaborator: async (email: string) => {
    const state = get()
    if (!state.user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if already sharing with someone
    if (state.sharingConfig && state.sharingConfig.status !== 'none') {
      return { success: false, error: 'Already sharing with someone. Remove current collaborator first.' }
    }

    try {
      // Find user by email
      const collaborator = await firestoreOps.findUserByEmail(email)
      
      if (!collaborator) {
        return { success: false, error: 'User not found. They need to create an account first.' }
      }

      if (collaborator.id === state.user.id) {
        return { success: false, error: 'Cannot share with yourself' }
      }

      // Grant immediate access to collaborator
      await firestoreOps.grantAccess(
        state.user.id,
        state.user.name,
        state.user.email,
        collaborator.id,
        collaborator.name,
        collaborator.email
      )

      return { success: true }
    } catch (error) {
      console.error('Error granting access:', error)
      return { success: false, error: 'Failed to grant access' }
    }
  },

  removeCollaborator: async () => {
    const state = get()
    if (!state.user || !state.sharingConfig || !state.sharingConfig.collaboratorId) return

    try {
      await firestoreOps.removeCollaborator(state.user.id, state.sharingConfig.collaboratorId)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error removing collaborator:', error)
      set({ error: 'Failed to remove collaborator' })
    }
  },

  acceptSharedList: async (ownerId: string) => {
    const state = get()
    if (!state.user) return

    try {
      await firestoreOps.acceptSharedList(state.user.id, ownerId)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error accepting shared list:', error)
      set({ error: 'Failed to accept invitation' })
    }
  },

  declineSharedList: async (ownerId: string) => {
    const state = get()
    if (!state.user) return

    try {
      await firestoreOps.declineSharedList(state.user.id, ownerId)
      // Real-time listener will update the state
    } catch (error) {
      console.error('Error declining shared list:', error)
      set({ error: 'Failed to decline invitation' })
    }
  },

  switchToList: (ownerId: string | null) => {
    const state = get()
    if (!state.user) return

    // Unsubscribe from current products
    if (unsubscribeProducts) {
      unsubscribeProducts()
      unsubscribeProducts = null
    }

    // Subscribe to new list
    const targetUserId = ownerId || state.user.id
    set({ productsLoading: true, activeListOwnerId: ownerId })
    
    unsubscribeProducts = firestoreOps.subscribeToProducts(targetUserId, (products) => {
      set({ products, productsLoading: false })
    })
  },

  getActiveListOwner: () => {
    const state = get()
    if (!state.activeListOwnerId) {
      // It's my list
      return state.user ? {
        id: state.user.id,
        name: state.user.name,
        email: state.user.email,
      } : null
    }

    // It's a shared list - find the owner
    const sharedList = state.sharedListsAccess.find(list => list.ownerId === state.activeListOwnerId)
    if (sharedList) {
      return {
        id: sharedList.ownerId,
        name: sharedList.ownerName,
        email: sharedList.ownerEmail,
      }
    }

    return null
  },
}))
