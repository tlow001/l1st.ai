'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { LoginModal } from '@/components/LoginModal'
import { RegisterModal } from '@/components/RegisterModal'
import { useStore } from '@/store'
import { Brain, CreditCard, TrendingUp, Upload, CheckSquare, ShoppingCart } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const checkAuth = useStore((state) => state.checkAuth)

  const handleLaunchApp = () => {
    if (checkAuth()) {
      router.push('/app/picklist')
    } else {
      setShowLoginModal(true)
    }
  }

  const handleGetStarted = () => {
    if (checkAuth()) {
      router.push('/app/picklist')
    } else {
      setShowRegisterModal(true)
    }
  }

  const handleAuthSuccess = () => {
    router.push('/app/picklist')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="landing" onLaunchApp={handleLaunchApp} />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Smart Shopping Lists
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Upload photos of your fridge, receipts, or recipes. Our AI extracts products and
            creates optimized shopping lists that learn from your habits.
          </p>
          <Button onClick={handleGetStarted} size="lg" className="text-lg px-10">
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-gray-200 mb-6">
                <Brain className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Assisted Extraction
              </h3>
              <p className="text-gray-600">
                Upload images of your fridge, receipts, or recipes and let AI automatically
                extract all the products you need.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-gray-200 mb-6">
                <CreditCard className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Credit-Based Pricing
              </h3>
              <p className="text-gray-600">
                Cost-effective processing at just 5 credits per image. More affordable than
                competitors like grocery.ai.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-gray-200 mb-6">
                <TrendingUp className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Learns Your Patterns
              </h3>
              <p className="text-gray-600">
                The more you shop, the smarter it gets. Lists are automatically reordered based
                on your shopping behavior.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            How It Works
          </h2>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-900" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  1. Upload Images
                </h3>
                <p className="text-lg text-gray-600">
                  Take photos of your fridge contents, grocery receipts, or recipe pages. Select
                  the image type and upload them to the platform.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-gray-900" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  2. Review and Curate
                </h3>
                <p className="text-lg text-gray-600">
                  AI extracts all products automatically. Review the list, add or remove items,
                  and curate your perfect shopping list.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-gray-900" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  3. Shop Efficiently
                </h3>
                <p className="text-lg text-gray-600">
                  Enter shop mode for a fullscreen, distraction-free experience. Check off items
                  as you go, and the system learns your shopping patterns for next time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} L1st.ai. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleAuthSuccess}
        onSwitchToRegister={() => {
          setShowLoginModal(false)
          setShowRegisterModal(true)
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={handleAuthSuccess}
        onSwitchToLogin={() => {
          setShowRegisterModal(false)
          setShowLoginModal(true)
        }}
      />
    </div>
  )
}
