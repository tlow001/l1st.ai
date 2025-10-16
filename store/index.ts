import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, AppActions, Product, UploadedImage, ShoppingTrip } from '@/types'
import { mockLogin, mockRegister } from '@/lib/mockAuth'

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
        const user = await mockLogin(email, password)
        if (user) {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      register: async (email, password, name) => {
        const user = await mockRegister(email, password, name)
        if (user) {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
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
