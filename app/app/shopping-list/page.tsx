'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { useStore } from '@/store'
import { useAuthGuard } from '@/lib/authGuard'
import { sortByLearningAlgorithm, isLearningActive } from '@/lib/learningAlgorithm'
import { X, GripVertical, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

export default function ShoppingListPage() {
  useAuthGuard()
  const router = useRouter()
  const { products, shoppingTrips, toggleProductInList, setShopMode } = useStore()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const shoppingListItems = useMemo(() => {
    const items = products.filter((p) => p.inShoppingList)
    return sortByLearningAlgorithm(items, shoppingTrips)
  }, [products, shoppingTrips])

  const learningActive = isLearningActive(shoppingTrips)

  const handleEnterShopMode = () => {
    setShopMode(true)
    router.push('/app/shop-mode')
  }

  const handleRemove = (id: string) => {
    toggleProductInList(id)
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Shopping List" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {learningActive && shoppingListItems.length > 0 && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
            <Sparkles className="w-5 h-5 text-gray-700" />
            <p className="text-sm text-gray-700">
              List optimized based on your shopping patterns
            </p>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {shoppingListItems.length} {shoppingListItems.length === 1 ? 'item' : 'items'}
          </p>
          {shoppingListItems.length > 0 && (
            <Button onClick={handleEnterShopMode} size="lg">
              Enter Shop Mode
            </Button>
          )}
        </div>

        {shoppingListItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg mb-4">No items in shopping list</p>
            <Link href="/app/picklist">
              <Button>Go to Pick List</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {shoppingListItems.map((product) => {
              const isExpanded = expandedItems.has(product.id)
              const hasDetails = product.details && (
                product.details.price ||
                product.details.nutritionalInfo ||
                product.details.alternatives?.length ||
                product.details.notes
              )

              return (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <button
                      className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing mt-1"
                      aria-label="Drag to reorder"
                    >
                      <GripVertical className="w-5 h-5" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                          {product.category}
                        </span>
                        <span>
                          {product.quantity} {product.unit}
                        </span>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && product.details && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
                          {product.details.price && (
                            <div>
                              <span className="font-medium text-gray-700">Price: </span>
                              <span className="text-gray-600">{product.details.price}</span>
                            </div>
                          )}
                          {product.details.nutritionalInfo && (
                            <div>
                              <span className="font-medium text-gray-700">Nutrition: </span>
                              <span className="text-gray-600">{product.details.nutritionalInfo}</span>
                            </div>
                          )}
                          {product.details.alternatives && product.details.alternatives.length > 0 && (
                            <div>
                              <span className="font-medium text-gray-700">Alternatives: </span>
                              <span className="text-gray-600">
                                {product.details.alternatives.join(', ')}
                              </span>
                            </div>
                          )}
                          {product.details.notes && (
                            <div>
                              <span className="font-medium text-gray-700">Notes: </span>
                              <span className="text-gray-600">{product.details.notes}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {hasDetails && (
                        <button
                          onClick={() => toggleExpanded(product.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label={`Remove ${product.name}`}
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
