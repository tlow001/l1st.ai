'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { LoginModal } from '@/components/LoginModal'
import { RegisterModal } from '@/components/RegisterModal'
import { useStore } from '@/store'
import { Apple, Smartphone, Zap, Clock, Cloud, Shield } from 'lucide-react'

export default function DownloadPage() {
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const checkAuth = useStore((state) => state.checkAuth)

  const handleLaunchApp = () => {
    if (checkAuth()) {
      router.push('/app/picklist')
    } else {
      setShowLoginModal(true)
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
            Download L1st.ai
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Get the mobile app for iOS and Android. Shop smarter with AI-powered lists
            on the go.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-medium text-lg w-64"
            >
              <Apple className="w-7 h-7" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-base font-semibold">App Store</div>
              </div>
            </a>

            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-medium text-lg w-64"
            >
              <Smartphone className="w-7 h-7" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-base font-semibold">Google Play</div>
              </div>
            </a>
          </div>

          <p className="text-sm text-gray-500">Also available on the web</p>
        </div>
      </section>

      {/* Mobile Features Section */}
      <section className="px-4 py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Mobile App Features
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-gray-200 mb-6">
                <Zap className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Native Performance
              </h3>
              <p className="text-gray-600">
                Optimized for mobile devices with instant image capture and fast processing.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-gray-200 mb-6">
                <Clock className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Offline Access
              </h3>
              <p className="text-gray-600">
                View and manage your shopping lists even without an internet connection.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-gray-200 mb-6">
                <Cloud className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cloud Sync
              </h3>
              <p className="text-gray-600">
                Seamlessly sync your lists across all your devices in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="px-4 py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Mobile vs Web App
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Mobile App
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Web App
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">AI Image Processing</td>
                  <td className="px-6 py-4 text-center text-sm">✓</td>
                  <td className="px-6 py-4 text-center text-sm">✓</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Shop Mode</td>
                  <td className="px-6 py-4 text-center text-sm">✓</td>
                  <td className="px-6 py-4 text-center text-sm">✓</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Learning Algorithm</td>
                  <td className="px-6 py-4 text-center text-sm">✓</td>
                  <td className="px-6 py-4 text-center text-sm">✓</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Offline Access</td>
                  <td className="px-6 py-4 text-center text-sm">✓</td>
                  <td className="px-6 py-4 text-center text-sm">—</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Native Camera</td>
                  <td className="px-6 py-4 text-center text-sm">✓</td>
                  <td className="px-6 py-4 text-center text-sm">—</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Push Notifications</td>
                  <td className="px-6 py-4 text-center text-sm">✓</td>
                  <td className="px-6 py-4 text-center text-sm">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is the mobile app free?
              </h3>
              <p className="text-gray-600">
                Yes, the mobile app is free to download. You'll receive 100 free credits to
                start, and additional credits can be purchased in-app.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do I need an account to use the app?
              </h3>
              <p className="text-gray-600">
                Yes, a free account is required to sync your shopping lists and access AI
                features across devices.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I use both the mobile and web app?
              </h3>
              <p className="text-gray-600">
                Absolutely! Your data syncs automatically between the mobile app and web app,
                so you can use whichever is most convenient.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What devices are supported?
              </h3>
              <p className="text-gray-600">
                The iOS app requires iOS 14 or later. The Android app requires Android 8.0 or
                later. The web app works on all modern browsers.
              </p>
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
