'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { useStore } from '@/store'
import { useAuthGuard } from '@/lib/authGuard'
import { ArrowLeft, MapPin, Calendar, Clock, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function ShoppingHistoryPage() {
  useAuthGuard()
  const router = useRouter()
  const { shoppingTrips, products } = useStore()

  // Sort trips by date (newest first)
  const sortedTrips = [...shoppingTrips].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || 'Unknown Product'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Shopping History" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/app/shopping-list">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Shopping List</span>
            </button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shopping History</h2>
          <p className="text-gray-600">
            {shoppingTrips.length} {shoppingTrips.length === 1 ? 'trip' : 'trips'} recorded
          </p>
        </div>

        {/* Trips List */}
        {sortedTrips.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No shopping trips yet</p>
            <p className="text-gray-400 text-sm">
              Complete a shopping session to start building your history
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTrips.map((trip, index) => (
              <div
                key={trip.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {/* Trip Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-base font-semibold text-gray-900">
                        {formatDate(trip.date)}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {trip.startTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{trip.startTime}</span>
                        </div>
                      )}
                      {trip.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="font-mono text-xs">{trip.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {trip.products.length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {trip.products.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Shopping Order:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trip.products
                      .sort((a, b) => a.checkOffOrder - b.checkOffOrder)
                      .map((product, idx) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                            {idx + 1}
                          </span>
                          <span>{getProductName(product.id)}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Trip Info Summary */}
                {trip.location && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      This trip data helps optimize future shopping lists for this location
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
