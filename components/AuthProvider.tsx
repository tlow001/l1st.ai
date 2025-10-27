'use client'

import { useEffect } from 'react'
import { onAuthStateChange } from '@/lib/firebaseAuth'
import { useStore } from '@/store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeFirestore = useStore((state) => state.initializeFirestore)
  const cleanupFirestore = useStore((state) => state.cleanupFirestore)

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        // User is signed in
        console.log('User authenticated:', user.email)
        useStore.setState({ user, isAuthenticated: true })
        // Initialize Firestore listeners
        initializeFirestore(user.id)
      } else {
        // User is signed out
        console.log('User signed out')
        // Cleanup Firestore listeners
        cleanupFirestore()
        useStore.setState({ user: null, isAuthenticated: false })
      }
    })

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
      cleanupFirestore()
    }
  }, [initializeFirestore, cleanupFirestore])

  return <>{children}</>
}
