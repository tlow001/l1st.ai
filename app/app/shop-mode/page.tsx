'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/Checkbox'
import { Button } from '@/components/Button'
import { useStore } from '@/store'
import { useAuthGuard } from '@/lib/authGuard'
import { X, CheckCircle2, Sparkles } from 'lucide-react'

export default function ShopModePage() {
  useAuthGuard()
  const router = useRouter()
  const { products, checkOffProduct, setShopMode, clearCheckedProducts, addShoppingTrip } = useStore()
  const [showCompletion, setShowCompletion] = useState(false)
  const [enableLearning, setEnableLearning] = useState(true)

  const shoppingListItems = products.filter((p) => p.inShoppingList)
  const uncheckedItems = shoppingListItems.filter((p) => !p.checkedOff)
  const checkedItems = shoppingListItems.filter((p) => p.checkedOff)

  useEffect(() => {
    if (shoppingListItems.length > 0 && uncheckedItems.length === 0 && !showCompletion) {
      setShowCompletion(true)
    }
  }, [uncheckedItems.length, shoppingListItems.length, showCompletion])

  const handleCheckOff = (id: string) => {
    checkOffProduct(id)
  }

  const handleExit = () => {
    if (uncheckedItems.length > 0) {
      const confirmed = confirm(
        `You have ${uncheckedItems.length} unchecked items. Are you sure you want to exit?`
      )
      if (!confirmed) return
    }

    setShopMode(false)
    clearCheckedProducts()
    router.push('/app/shopping-list')
  }

  const handleSaveAndExit = () => {
    // Only save shopping trip for learning if enabled
    if (enableLearning) {
      const trip = {
        id: Math.random().toString(36).substring(2, 11),
        date: new Date().toISOString(),
        products: checkedItems.map((p) => ({
          id: p.id,
          checkOffOrder: p.checkOffOrder || 0,
        })),
      }
      addShoppingTrip(trip)
    }

    setShopMode(false)
    clearCheckedProducts()
    router.push('/app/shopping-list')
  }

  if (shoppingListItems.length === 0) {
    router.push('/app/shopping-list')
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Minimal Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{checkedItems.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{shoppingListItems.length}</span> items
          </div>
          <button
            onClick={handleExit}
            className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
            aria-label="Exit shop mode"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Learning Info Banner */}
      <div className="mx-4 mt-4 mb-2">
        <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <Sparkles className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 mb-3">
              As you check off items, the app learns your shopping patterns. Future lists will
              automatically reorder to match the order you shop.
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enableLearning}
                onChange={(e) => setEnableLearning(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
              />
              <span className="text-sm font-medium text-gray-900">
                Enable learning for this trip
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Product List */}
      <main className="flex-1 px-4 py-2 space-y-3 overflow-auto">
        {/* Unchecked Items */}
        {uncheckedItems.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg"
          >
            <Checkbox
              size="lg"
              checked={product.checkedOff}
              onChange={() => handleCheckOff(product.id)}
              aria-label={`Check off ${product.name}`}
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {product.name}
              </h3>
              <p className="text-base text-gray-600">
                {product.quantity} {product.unit}
              </p>
            </div>
          </div>
        ))}

        {/* Checked Items */}
        {checkedItems.length > 0 && (
          <div className="pt-6 space-y-3">
            {checkedItems.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
              >
                <Checkbox
                  size="lg"
                  checked={true}
                  onChange={() => {}}
                  aria-label={`${product.name} checked`}
                  disabled
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-500 line-through mb-1">
                    {product.name}
                  </h3>
                  <p className="text-base text-gray-400">
                    {product.quantity} {product.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Sheet */}
      <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-4">
        <div className="text-center text-sm text-gray-600">
          {uncheckedItems.length > 0
            ? `${uncheckedItems.length} ${uncheckedItems.length === 1 ? 'item' : 'items'} remaining`
            : 'All items checked!'}
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <CheckCircle2 className="w-10 h-10 text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Shopping Complete!
            </h2>
            <p className="text-gray-600 mb-8">
              {enableLearning
                ? "You've checked off all items in your list. Your shopping patterns will help optimize future lists."
                : "You've checked off all items in your list."}
            </p>
            <Button onClick={handleSaveAndExit} size="lg" className="w-full">
              Save & Exit
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
