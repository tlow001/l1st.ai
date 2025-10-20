'use client'

import { useEffect } from 'react'
import { onAuthStateChange } from '@/lib/firebaseAuth'
import { useStore } from '@/store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuthState = useStore((state) => ({
    setUser: (user: any) => state.user !== user && (state.user = user),
    setIsAuthenticated: (isAuth: boolean) => state.isAuthenticated !== isAuth && (state.isAuthenticated = isAuth),
  }))

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        // User is signed in
        useStore.setState({ user, isAuthenticated: true })
      } else {
        // User is signed out
        useStore.setState({ user: null, isAuthenticated: false })
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return <>{children}</>
}
