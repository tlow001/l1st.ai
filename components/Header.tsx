'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/store'
import { useLanguage, useTranslation } from '@/lib/i18n'
import { ChevronDown, User as UserIcon, Globe } from 'lucide-react'

interface HeaderProps {
  variant?: 'landing' | 'app'
  title?: string
  onLaunchApp?: () => void
}

export function Header({ variant = 'app', title, onLaunchApp }: HeaderProps) {
  const credits = useStore((state) => state.credits)
  const user = useStore((state) => state.user)
  const logout = useStore((state) => state.logout)
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  if (variant === 'landing') {
    return (
      <header className="bg-primary-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-h3 font-bold text-secondary-blue">l1st</span>
              <span className="text-h3 font-bold text-accent-teal">.</span>
              <span className="text-h3 font-bold text-secondary-blue">ai</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/download"
                className="text-body text-white/80 hover:text-white transition-colors duration-standard"
              >
                {t('download')}
              </Link>
              <button
                onClick={onLaunchApp}
                className="px-5 h-10 bg-primary-purple text-white rounded-md hover:bg-primary-purple/92 transition-all duration-standard font-medium text-button"
              >
                {t('launchApp')}
              </button>
            </nav>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-primary-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-0.5">
              <span className="text-h3 font-bold text-secondary-blue">l1st</span>
              <span className="text-h3 font-bold text-accent-teal">.</span>
              <span className="text-h3 font-bold text-secondary-blue">ai</span>
            </Link>
            {title && (
              <>
                <div className="w-px h-6 bg-white/20" />
                <h1 className="text-body-lg font-medium text-white/90">{title}</h1>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-all duration-standard"
                aria-label="Change language"
              >
                <Globe className="w-5 h-5 text-white/80" />
                <span className="text-body-sm text-white/90 uppercase font-medium">{language}</span>
                <ChevronDown className="w-4 h-4 text-white/70" />
              </button>
              {showLangMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-card-hover z-20">
                    <button
                      onClick={() => {
                        setLanguage('en')
                        setShowLangMenu(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-body hover:bg-gray-50 transition-colors duration-standard first:rounded-t-lg ${
                        language === 'en' ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('nl')
                        setShowLangMenu(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-body hover:bg-gray-50 transition-colors duration-standard last:rounded-b-lg ${
                        language === 'nl' ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      🇳🇱 Nederlands
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-md">
              <span className="text-body-sm text-white/70">{t('credits')}:</span>
              <span className="text-body-lg font-semibold text-white">{credits}</span>
            </div>
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 transition-all duration-standard"
                  aria-label="User menu"
                >
                  <UserIcon className="w-5 h-5 text-white/80" />
                  <span className="text-body-sm text-white/90 max-w-[120px] truncate font-medium">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-white/70" />
                </button>
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-card-hover z-20">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-body-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-body-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                          window.location.href = '/'
                        }}
                        className="w-full px-4 py-2 text-left text-body text-gray-700 hover:bg-gray-50 transition-colors duration-standard rounded-b-lg"
                      >
                        {t('logout')}
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
