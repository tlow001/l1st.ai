'use client'

import { useState } from 'react'
import { useStore } from '@/store'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { Users, Mail, X, Check, Clock } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const { sharingConfig, inviteCollaborator, removeCollaborator } = useStore()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await inviteCollaborator(email)

    if (result.success) {
      setSuccess(true)
      setEmail('')
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || 'Failed to send invitation')
    }

    setLoading(false)
  }

  const handleRemove = async () => {
    if (!confirm('Remove collaborator? They will lose access to your list immediately.')) {
      return
    }

    setLoading(true)
    await removeCollaborator()
    setLoading(false)
  }

  const getStatusBadge = () => {
    if (!sharingConfig) return null

    switch (sharingConfig.status) {
      case 'accepted':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-green/10 text-success-green text-body-xs font-semibold rounded">
            <Check className="w-3 h-3" />
            Active
          </span>
        )
      default:
        return null
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Your List">
      <div className="space-y-6">
        {/* Current Collaborator */}
        {sharingConfig && sharingConfig.collaboratorEmail && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-body-sm font-medium text-gray-700 mb-1">Currently sharing with:</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-body text-gray-900">{sharingConfig.collaboratorEmail}</span>
                  {getStatusBadge()}
                </div>
                {sharingConfig.collaboratorName && (
                  <p className="text-body-sm text-gray-600 mt-1">{sharingConfig.collaboratorName}</p>
                )}
              </div>
              <button
                onClick={handleRemove}
                disabled={loading}
                className="text-error-red hover:text-error-red/80 transition-colors p-1"
                title="Remove collaborator"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Invite Form */}
        {(!sharingConfig || sharingConfig.status === 'none') && (
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <p className="text-body-sm text-gray-600 mb-4">
                Enter the email address of the person you want to share your list with. They'll automatically get access when they log in.
              </p>
              <Input
                type="email"
                label="Collaborator Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 bg-error-red/10 border border-error-red/20 rounded-lg">
                <p className="text-body-sm text-error-red">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-success-green/10 border border-success-green/20 rounded-lg">
                <p className="text-body-sm text-success-green">
                  ✓ Access granted! They can now see and edit your list.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                Grant Access
              </Button>
            </div>
          </form>
        )}

        {/* Info Note */}
        <div className="p-3 bg-secondary-blue/5 border border-secondary-blue/20 rounded-lg">
          <p className="text-body-xs text-gray-600">
            <strong>Note:</strong> You can only share with one person at a time. Both of you will see changes instantly.
          </p>
        </div>
      </div>
    </Modal>
  )
}
