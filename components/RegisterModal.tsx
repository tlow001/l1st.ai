'use client'

import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Input } from './Input'
import { Button } from './Button'
import { useStore } from '@/store'
import { isValidEmail, isValidPassword } from '@/lib/mockAuth'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const register = useStore((state) => state.register)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('')
      setEmail('')
      setPassword('')
      setError('')
      setLoading(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await register(email, password, name.trim() || email.split('@')[0] || 'User')
      if (success) {
        onSuccess()
        onClose()
        setName('')
        setEmail('')
        setPassword('')
      } else {
        setError('An error occurred. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setName('')
    setEmail('')
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign Up">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />

        <Input
          label="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
        />

        <div className="flex flex-col gap-3 pt-2">
          <Button type="submit" loading={loading} className="w-full">
            Sign Up
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Already have an account? <span className="font-semibold">Log in</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
