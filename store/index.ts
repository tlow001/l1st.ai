import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, AppActions, Product, UploadedImage, ShoppingTrip } from '@/types'
import { signInWithEmail, registerWithEmail, signInWithGoogle, signOut as firebaseSignOut } from '@/lib/firebaseAuth'

type Store = AppState & AppActions

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      uploadedImages: [],
      shoppingTrips: [],
      credits: 100,
      isShopMode: false,
      user: null,
      isAuthenticated: false,

      // Actions
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: Math.random().toString(36).substring(2, 11),
          inShoppingList: false,
          checkedOff: false,
        }
        set((state) => ({
          products: [...state.products, newProduct],
        }))
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }))
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      },

      toggleProductInList: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, inShoppingList: !p.inShoppingList } : p
          ),
        }))
      },

      checkOffProduct: (id) => {
        const state = get()
        const checkedProducts = state.products.filter((p) => p.checkedOff).length

        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, checkedOff: true, checkOffOrder: checkedProducts + 1 }
              : p
          ),
        }))
      },

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

      addShoppingTrip: (trip) => {
        set((state) => ({
          shoppingTrips: [...state.shoppingTrips, trip],
        }))
      },

      useCredits: (amount) => {
        const state = get()
        if (state.credits >= amount) {
          set({ credits: state.credits - amount })
          return true
        }
        return false
      },

      setShopMode: (isShopMode) => {
        set({ isShopMode })
      },

      clearCheckedProducts: () => {
        set((state) => ({
          products: state.products.map((p) => ({
            ...p,
            checkedOff: false,
            checkOffOrder: undefined,
          })),
        }))
      },

      // Auth actions
      login: async (email, password) => {
        try {
          const user = await signInWithEmail(email, password)
          if (user) {
            set({ user, isAuthenticated: true })
            return true
          }
          return false
        } catch (error) {
          console.error('Login error:', error)
          throw error
        }
      },

      loginWithGoogle: async () => {
        try {
          const user = await signInWithGoogle()
          if (user) {
            set({ user, isAuthenticated: true })
            return true
          }
          return false
        } catch (error) {
          console.error('Google login error:', error)
          throw error
        }
      },

      register: async (email, password, name) => {
        try {
          const user = await registerWithEmail(email, password, name)
          if (user) {
            set({ user, isAuthenticated: true })
            return true
          }
          return false
        } catch (error) {
          console.error('Register error:', error)
          throw error
        }
      },

      logout: async () => {
        try {
          await firebaseSignOut()
          set({ user: null, isAuthenticated: false })
        } catch (error) {
          console.error('Logout error:', error)
          throw error
        }
      },

      checkAuth: () => {
        const state = get()
        return state.isAuthenticated && state.user !== null
      },
    }),
    {
      name: 'l1st-storage',
    }
  )
)
