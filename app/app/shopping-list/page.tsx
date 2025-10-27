'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { Checkbox } from '@/components/Checkbox'
import { ShareModal } from '@/components/ShareModal'
import { ListSwitcher } from '@/components/ListSwitcher'
import { useStore } from '@/store'
import { useAuthGuard } from '@/lib/authGuard'
import { useTranslation } from '@/lib/i18n'
import { sortByLearningAlgorithm, isLearningActive } from '@/lib/learningAlgorithm'
import { X, GripVertical, Sparkles, ChevronDown, ChevronUp, ArrowLeft, CheckCircle2, ShoppingCart, Users } from 'lucide-react'

export default function ShoppingListPage() {
  useAuthGuard()
  const router = useRouter()
  const { t } = useTranslation()
  const { products, shoppingTrips, activeListOwnerId, toggleProductInList, checkOffProduct, clearCheckedProducts, addShoppingTrip, reorderProducts } = useStore()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isShopMode, setIsShopMode] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [enableLearning, setEnableLearning] = useState(true)
  const [sessionInfo, setSessionInfo] = useState<{
    location: string
    startTime: string
    date: string
  } | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  const shoppingListItems = useMemo(() => {
    const items = products.filter((p) => p.inShoppingList)
    // Pass current location to sorting algorithm if in shop mode
    return sortByLearningAlgorithm(items, shoppingTrips, sessionInfo?.location)
  }, [products, shoppingTrips, sessionInfo?.location])

  const uncheckedItems = shoppingListItems.filter((p) => !p.checkedOff)
  const checkedItems = shoppingListItems.filter((p) => p.checkedOff)
  const learningActive = isLearningActive(shoppingTrips)

  // Calculate estimated total cost
  const estimatedTotal = useMemo(() => {
    let total = 0
    let itemsWithPrice = 0
    
    shoppingListItems.forEach((product) => {
      if (product.details?.price) {
        const price = product.details.price
        
        // Handle both number and string prices
        if (typeof price === 'number') {
          total += price
          itemsWithPrice++
        } else if (typeof price === 'string') {
          // Extract numeric value from price string (e.g., "$3.99" or "€5.49")
          const priceMatch = price.match(/[\d.]+/)
          if (priceMatch) {
            total += parseFloat(priceMatch[0])
            itemsWithPrice++
          }
        }
      }
    })
    
    return { total, itemsWithPrice, hasData: itemsWithPrice > 0 }
  }, [shoppingListItems])

  useEffect(() => {
    if (isShopMode && shoppingListItems.length > 0 && uncheckedItems.length === 0 && !showCompletion) {
      setShowCompletion(true)
    }
  }, [uncheckedItems.length, shoppingListItems.length, showCompletion, isShopMode])

  const handleEnterShopMode = async () => {
    // Capture session start time
    const now = new Date()
    const time = now.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    const date = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })

    // Try to get geolocation
    let location = 'Location unavailable'
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 60000
          })
        })
        
        // Use reverse geocoding to get location name (simplified - just coordinates for now)
        location = `${position.coords.latitude.toFixed(4)}°, ${position.coords.longitude.toFixed(4)}°`
      } catch (error) {
        console.log('Location access denied or unavailable')
      }
    }

    setSessionInfo({ location, startTime: time, date })
    setIsShopMode(true)
  }

  const handleExitClick = () => {
    setShowExitConfirm(true)
  }

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSkipReceipt = () => {
    if (enableLearning && sessionInfo) {
      const trip = {
        id: Math.random().toString(36).substring(2, 11),
        date: new Date().toISOString(),
        location: sessionInfo.location,
        startTime: sessionInfo.startTime,
        products: checkedItems.map((p) => ({
          id: p.id,
          checkOffOrder: p.checkOffOrder || 0,
        })),
      }
      addShoppingTrip(trip)
    }
    setIsShopMode(false)
    clearCheckedProducts()
    setShowCompletion(false)
    setShowExitConfirm(false)
    setSessionInfo(null)
    setReceiptFile(null)
    setReceiptPreview(null)
  }

  const handleSaveWithReceipt = async () => {
    // TODO: Process receipt with AI to extract prices
    // For now, just save the trip
    if (enableLearning && sessionInfo) {
      const trip = {
        id: Math.random().toString(36).substring(2, 11),
        date: new Date().toISOString(),
        location: sessionInfo.location,
        startTime: sessionInfo.startTime,
        products: checkedItems.map((p) => ({
          id: p.id,
          checkOffOrder: p.checkOffOrder || 0,
        })),
      }
      addShoppingTrip(trip)
    }
    setIsShopMode(false)
    clearCheckedProducts()
    setShowCompletion(false)
    setShowExitConfirm(false)
    setSessionInfo(null)
    setReceiptFile(null)
    setReceiptPreview(null)
  }

  const handleCheckOff = (id: string) => {
    checkOffProduct(id)
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

  const handleDragStart = (e: React.DragEvent, productId: string) => {
    setDraggedItem(productId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, productId: string) => {
    e.preventDefault()
    if (draggedItem && draggedItem !== productId) {
      setDragOverItem(productId)
    }
  }

  const handleDrop = (e: React.DragEvent, dropProductId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === dropProductId) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    const draggedIndex = shoppingListItems.findIndex(p => p.id === draggedItem)
    const dropIndex = shoppingListItems.findIndex(p => p.id === dropProductId)

    if (draggedIndex === -1 || dropIndex === -1) return

    // Create new array with reordered shopping list items
    const reorderedShoppingList = [...shoppingListItems]
    const [removed] = reorderedShoppingList.splice(draggedIndex, 1)
    reorderedShoppingList.splice(dropIndex, 0, removed)

    // Update the full products array preserving order of non-shopping-list items
    const nonShoppingListProducts = products.filter(p => !p.inShoppingList)
    const newProducts = [...reorderedShoppingList, ...nonShoppingListProducts]
    
    reorderProducts(newProducts)
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  // Touch handlers for mobile drag and drop
  const handleTouchStart = (e: React.TouchEvent, productId: string) => {
    setDraggedItem(productId)
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedItem || touchStartY === null) return
    
    const touchY = e.touches[0].clientY
    const elements = document.elementsFromPoint(e.touches[0].clientX, touchY)
    
    // Find the product card element
    const productCard = elements.find(el => 
      el.getAttribute('data-product-id') && 
      el.getAttribute('data-product-id') !== draggedItem
    )
    
    if (productCard) {
      const targetId = productCard.getAttribute('data-product-id')
      if (targetId) {
        setDragOverItem(targetId)
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!draggedItem || !dragOverItem) {
      setDraggedItem(null)
      setDragOverItem(null)
      setTouchStartY(null)
      return
    }

    const draggedIndex = shoppingListItems.findIndex(p => p.id === draggedItem)
    const dropIndex = shoppingListItems.findIndex(p => p.id === dragOverItem)

    if (draggedIndex !== -1 && dropIndex !== -1 && draggedIndex !== dropIndex) {
      const reorderedShoppingList = [...shoppingListItems]
      const [removed] = reorderedShoppingList.splice(draggedIndex, 1)
      reorderedShoppingList.splice(dropIndex, 0, removed)

      const nonShoppingListProducts = products.filter(p => !p.inShoppingList)
      const newProducts = [...reorderedShoppingList, ...nonShoppingListProducts]
      
      reorderProducts(newProducts)
    }

    setDraggedItem(null)
    setDragOverItem(null)
    setTouchStartY(null)
  }

  // Shop Mode View
  if (isShopMode) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {/* Minimal Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{checkedItems.length}</span> {t('ofItems')}{' '}
              <span className="font-semibold text-gray-900">{shoppingListItems.length}</span> {t('items')}
            </div>
            <button
              onClick={handleExitClick}
              className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
              aria-label="Exit shop mode"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Merged Learning & Session Component */}
        <div className="mx-4 mt-4 mb-2">
          <div className="flex items-start gap-3 p-4 bg-gray-100 rounded-lg border border-gray-200">
            <Sparkles className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 mb-3">
                {checkedItems.length === 0 ? (
                  t('learningMessageStart')
                ) : checkedItems.length < shoppingListItems.length ? (
                  t('learningMessageProgress').replace('{checked}', checkedItems.length.toString()).replace('{total}', shoppingListItems.length.toString())
                ) : (
                  t('learningMessageComplete')
                )}
              </p>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={enableLearning}
                  onChange={(e) => setEnableLearning(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                />
                <span className="text-sm font-medium text-gray-900">
                  {t('enableLearning')}
                </span>
              </label>
              {enableLearning && sessionInfo && (
                <div className="pt-3 border-t border-gray-300">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">{sessionInfo.date}</span>
                    <span>•</span>
                    <span className="font-medium">{sessionInfo.startTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <span>📍</span>
                    <span>{sessionInfo.location}</span>
                  </div>
                </div>
              )}
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

        {/* Receipt Upload Modal (for exit or completion) */}
        {(showCompletion || showExitConfirm) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-green/10 mb-4">
                  <CheckCircle2 className="w-10 h-10 text-accent-green" />
                </div>
                <h2 className="text-h2 text-gray-900 mb-2">
                  {showCompletion ? 'Shopping Complete!' : 'Exit Shopping?'}
                </h2>
                <p className="text-body text-gray-600">
                  {showCompletion 
                    ? "Upload your receipt to automatically update prices and track your spending."
                    : "Upload your receipt before leaving to track prices and spending."}
                </p>
              </div>

              {/* Receipt Upload Area */}
              <div className="mb-6">
                {!receiptPreview ? (
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-purple hover:bg-gray-50 transition-all cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptFileChange}
                        className="hidden"
                      />
                      <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-body font-medium text-gray-700">Upload Receipt</p>
                      <p className="text-body-sm text-gray-500 mt-1">Click to select or drag and drop</p>
                    </div>
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setReceiptFile(null)
                        setReceiptPreview(null)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {receiptFile ? (
                  <Button onClick={handleSaveWithReceipt} size="lg" className="w-full">
                    Save with Receipt
                  </Button>
                ) : (
                  <Button onClick={handleSkipReceipt} variant="secondary" size="lg" className="w-full">
                    Skip & Continue
                  </Button>
                )}
                <button
                  onClick={() => {
                    setShowCompletion(false)
                    setShowExitConfirm(false)
                    setReceiptFile(null)
                    setReceiptPreview(null)
                  }}
                  className="text-body text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // List View
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title={t('shoppingList')} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Back to Picklist Button and History Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/app/picklist">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t('backToPicklist')}</span>
            </button>
          </Link>
          {shoppingTrips.length > 0 && (
            <Link href="/app/history">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <span className="font-medium">View History</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                  {shoppingTrips.length}
                </span>
              </button>
            </Link>
          )}
        </div>
        {learningActive && shoppingListItems.length > 0 && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-gray-100 rounded-lg border border-gray-200">
            <Sparkles className="w-5 h-5 text-gray-700" />
            <p className="text-sm text-gray-700">
              List optimized based on your shopping patterns
            </p>
          </div>
        )}

        {/* List Switcher and Actions */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <ListSwitcher />
          
          {/* Share Button (only show for my list) */}
          {!activeListOwnerId && (
            <Button 
              variant="secondary" 
              onClick={() => setShowShareModal(true)}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Share
            </Button>
          )}
        </div>

        {/* List Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600">
                {shoppingListItems.length} {shoppingListItems.length === 1 ? 'item' : 'items'}
              </p>
              {estimatedTotal.hasData && (
                <p className="text-sm text-gray-500 mt-1">
                  {t('estimatedTotal')}: <span className="font-semibold text-gray-900">€{estimatedTotal.total.toFixed(2)}</span>
                  {estimatedTotal.itemsWithPrice < shoppingListItems.length && (
                    <span className="ml-1">({estimatedTotal.itemsWithPrice} of {shoppingListItems.length} {t('itemsWithPrices')})</span>
                  )}
                </p>
              )}
            </div>
            {shoppingListItems.length > 0 && (
              <Button onClick={handleEnterShopMode} size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('startShopping') || 'Start Shopping'}
              </Button>
            )}
          </div>
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
                  data-product-id={product.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, product.id)}
                  onDragOver={(e) => handleDragOver(e, product.id)}
                  onDrop={(e) => handleDrop(e, product.id)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, product.id)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`bg-white border rounded-lg p-4 transition-all touch-none ${
                    draggedItem === product.id
                      ? 'opacity-50 border-gray-400'
                      : dragOverItem === product.id
                      ? 'border-2 border-gray-900 shadow-lg'
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing mt-1"
                      aria-label="Drag to reorder"
                    >
                      <GripVertical className="w-5 h-5" />
                    </div>

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

        {/* Share Modal */}
        <ShareModal 
          isOpen={showShareModal} 
          onClose={() => setShowShareModal(false)} 
        />
      </main>
    </div>
  )
}
