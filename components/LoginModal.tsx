'use client'

import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { Input } from './Input'
import { Button } from './Button'
import { useStore } from '@/store'
import { isValidEmail, isValidPassword } from '@/lib/mockAuth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSuccess, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = useStore((state) => state.login)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
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
      const success = await login(email, password)
      if (success) {
        onSuccess()
        onClose()
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
    setEmail('')
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Log In">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
            {error}
          </div>
        )}

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
          autoComplete="current-password"
        />

        <div className="flex flex-col gap-3 pt-2">
          <Button type="submit" loading={loading} className="w-full">
            Log In
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Don't have an account? <span className="font-semibold">Sign up</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
