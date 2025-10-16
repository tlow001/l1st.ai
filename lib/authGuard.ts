/**
 * Auth guard hook for protecting routes
 * Use in page components to ensure user is authenticated
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'

export function useAuthGuard() {
  const router = useRouter()
  const checkAuth = useStore((state) => state.checkAuth)
  const isAuthenticated = useStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/')
    }
  }, [checkAuth, router, isAuthenticated])

  return { isAuthenticated }
}
