'use client'

import { useStore } from '@/store'
import { Button } from './Button'
import { Mail, X } from 'lucide-react'

export function InvitationBanner() {
  const { sharedListsAccess, acceptSharedList, declineSharedList } = useStore()

  // Find pending invitations
  const pendingInvitations = sharedListsAccess.filter(
    (list) => list.status === 'pending'
  )

  if (pendingInvitations.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {pendingInvitations.map((invitation) => (
        <div
          key={invitation.ownerId}
          className="bg-secondary-blue/10 border-2 border-secondary-blue/30 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-blue/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-secondary-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-body font-semibold text-gray-900 mb-1">
                List Sharing Invitation
              </h3>
              <p className="text-body-sm text-gray-700 mb-3">
                <strong>{invitation.ownerName}</strong> ({invitation.ownerEmail}) has invited you to collaborate on their shopping list.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => acceptSharedList(invitation.ownerId)}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => declineSharedList(invitation.ownerId)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
