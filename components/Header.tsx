'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/store'
import { ChevronDown, User as UserIcon } from 'lucide-react'

interface HeaderProps {
  variant?: 'landing' | 'app'
  title?: string
  onLaunchApp?: () => void
}

export function Header({ variant = 'app', title, onLaunchApp }: HeaderProps) {
  const credits = useStore((state) => state.credits)
  const user = useStore((state) => state.user)
  const logout = useStore((state) => state.logout)
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (variant === 'landing') {
    return (
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              L1st.ai
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/download"
                className="text-base text-gray-600 hover:text-gray-900 transition-colors"
              >
                Download
              </Link>
              <button
                onClick={onLaunchApp}
                className="px-5 h-10 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-medium"
              >
                Launch App
              </button>
            </nav>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              L1st.ai
            </Link>
            {title && (
              <>
                <div className="w-px h-6 bg-gray-300" />
                <h1 className="text-lg font-medium text-gray-700">{title}</h1>
              </>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Credits:</span>
              <span className="text-lg font-semibold text-gray-900">{credits}</span>
            </div>
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  aria-label="User menu"
                >
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-20">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                          window.location.href = '/'
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
