'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/store'
import { useAuthGuard } from '@/lib/authGuard'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { Users, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import * as firestoreOps from '@/lib/firestoreOperations'

export default function AcceptInvitePage() {
  useAuthGuard()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, acceptSharedList } = useStore()
  
  const [loading, setLoading] = useState(true)
  const [ownerInfo, setOwnerInfo] = useState<{ id: string; name: string; email: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)

  const ownerId = searchParams.get('from')

  useEffect(() => {
    const loadOwnerInfo = async () => {
      if (!ownerId || !user) {
        setError('Invalid invitation link')
        setLoading(false)
        return
      }

      if (ownerId === user.id) {
        setError('You cannot accept an invitation to your own list')
        setLoading(false)
        return
      }

      try {
        // Get owner's information
        const owner = await firestoreOps.getUserById(ownerId)
        
        if (!owner) {
          setError('User not found')
          setLoading(false)
          return
        }

        // Check if there's already a sharing config
        const sharingConfig = await firestoreOps.getSharingConfig(ownerId)
        
        if (sharingConfig && sharingConfig.collaboratorId && sharingConfig.collaboratorId !== user.id) {
          setError('This list is already shared with someone else')
          setLoading(false)
          return
        }

        // If no sharing config exists, create the invitation
        if (!sharingConfig || !sharingConfig.collaboratorId) {
          await firestoreOps.inviteCollaborator(
            ownerId,
            owner.name,
            owner.email,
            user.id,
            user.name,
            user.email
          )
        }

        setOwnerInfo(owner)
        setLoading(false)
      } catch (err) {
        console.error('Error loading invitation:', err)
        setError('Failed to load invitation details')
        setLoading(false)
      }
    }

    loadOwnerInfo()
  }, [ownerId, user])

  const handleAccept = async () => {
    if (!ownerId || !user) return

    setAccepting(true)
    try {
      await acceptSharedList(ownerId)
      // Redirect to shopping list after accepting
      setTimeout(() => {
        router.push('/app/shopping-list')
      }, 1500)
    } catch (err) {
      console.error('Error accepting invitation:', err)
      setError('Failed to accept invitation')
      setAccepting(false)
    }
  }

  const handleDecline = () => {
    router.push('/app/shopping-list')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header title="Accept Invitation" />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary-purple animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading invitation...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header title="Accept Invitation" />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-red/10 mb-4">
              <XCircle className="w-10 h-10 text-error-red" />
            </div>
            <h1 className="text-h2 text-gray-900 mb-2">Invalid Invitation</h1>
            <p className="text-body text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/app/shopping-list')}>
              Go to My Lists
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (accepting) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header title="Accept Invitation" />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-green/10 mb-4">
              <CheckCircle2 className="w-10 h-10 text-success-green" />
            </div>
            <h1 className="text-h2 text-gray-900 mb-2">Invitation Accepted!</h1>
            <p className="text-body text-gray-600 mb-4">
              You now have access to the shared list. Redirecting...
            </p>
            <Loader2 className="w-8 h-8 text-primary-purple animate-spin mx-auto" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Accept Invitation" />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-purple/10 mb-4">
              <Users className="w-10 h-10 text-primary-purple" />
            </div>
            <h1 className="text-h2 text-gray-900 mb-2">List Sharing Invitation</h1>
            {ownerInfo && (
              <p className="text-body text-gray-600">
                <strong>{ownerInfo.name}</strong> has invited you to collaborate on their shopping list.
              </p>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-body-sm font-semibold text-gray-900 mb-2">
                What you'll be able to do:
              </h3>
              <ul className="space-y-2 text-body-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-green mt-0.5 flex-shrink-0" />
                  <span>Add and remove products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-green mt-0.5 flex-shrink-0" />
                  <span>Check off items while shopping</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-green mt-0.5 flex-shrink-0" />
                  <span>See updates in real-time</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleAccept} size="lg" className="w-full">
              Accept Invitation
            </Button>
            <Button onClick={handleDecline} variant="secondary" size="lg" className="w-full">
              Decline
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
