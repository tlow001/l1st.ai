'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Modal } from '@/components/Modal'
import { UploadModal } from '@/components/UploadModal'
import { ProductCard } from '@/components/ProductCard'
import { VoiceInput } from '@/components/VoiceInput'
import { useStore } from '@/store'
import { useAuthGuard } from '@/lib/authGuard'
import { useTranslation } from '@/lib/i18n'
import { ProductCategory, Unit, ImageSource } from '@/types'
import { Plus, Search, CheckCircle2, Circle, Upload, Mic, Receipt, Image, Refrigerator, UtensilsCrossed, BookOpen } from 'lucide-react'

export default function PicklistPage() {
  useAuthGuard()
  const router = useRouter()
  const { t } = useTranslation()
  const { 
    picklistProducts, // Use picklistProducts instead of products - this always shows user's own products
    toggleProductInPicklist, 
    deleteProductFromPicklist, 
    addProductToPicklist, 
    updateProductInPicklist, 
    clearAllPicklistProducts,
    user,
    activeListOwnerId 
  } = useStore()

  // picklistProducts is ALWAYS the user's own products, regardless of activeListOwnerId
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All')
  const [selectedSources, setSelectedSources] = useState<Set<ImageSource>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pantry & Dry Goods' as ProductCategory,
    quantity: '1',
    unit: 'unit' as Unit,
    notes: '',
  })

  const categories: Array<ProductCategory | 'All'> = [
    'All',
    'Fresh Produce',
    'Meat & Seafood',
    'Dairy & Eggs',
    'Bakery & Bread',
    'Frozen Foods',
    'Pantry & Dry Goods',
    'Canned & Jarred Foods',
    'Snacks & Chips',
    'Candy & Chocolate',
    'Beverages',
    'Wine & Spirits',
    'Breakfast & Cereals',
    'Deli & Prepared Foods',
    'Condiments & Sauces',
    'Baking Supplies',
    'Health & Wellness',
    'Baby Products',
    'Pet Supplies',
    'Personal Care & Beauty',
    'Household & Cleaning',
    'Kitchen & Dining',
    'Home & Garden',
  ]

  const filteredProducts = useMemo(() => {
    return picklistProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesSource = selectedSources.size === 0 || (product.source && selectedSources.has(product.source))
      return matchesSearch && matchesCategory && matchesSource
    })
  }, [picklistProducts, searchQuery, selectedCategory, selectedSources])

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    picklistProducts.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1
    })
    return counts
  }, [picklistProducts])

  const selectionStats = useMemo(() => {
    const total = picklistProducts.length
    const selected = picklistProducts.filter((p) => p.inShoppingList).length
    const remaining = total - selected
    const percentage = total > 0 ? Math.round((selected / total) * 100) : 0

    return { total, selected, remaining, percentage }
  }, [picklistProducts])

  const shoppingListCount = selectionStats.selected

  // Helper function to auto-categorize products based on name
  const categorizeProduct = (productName: string): ProductCategory => {
    const name = productName.toLowerCase()
    
    // Fresh Produce
    if (/(apple|banana|orange|tomato|lettuce|spinach|carrot|potato|onion|garlic|pepper|avocado|berry|grape|lemon|lime|cucumber|broccoli|cauliflower|celery|mushroom|fruit|vegetable)/i.test(name)) {
      return 'Fresh Produce'
    }
    // Meat & Seafood
    if (/(chicken|beef|pork|turkey|fish|salmon|shrimp|meat|steak|bacon|sausage|ham|lamb)/i.test(name)) {
      return 'Meat & Seafood'
    }
    // Dairy & Eggs
    if (/(milk|cheese|yogurt|butter|cream|egg|dairy)/i.test(name)) {
      return 'Dairy & Eggs'
    }
    // Bakery & Bread
    if (/(bread|baguette|roll|croissant|bagel|muffin|pastry|donut|bun)/i.test(name)) {
      return 'Bakery & Bread'
    }
    // Beverages
    if (/(water|juice|soda|coffee|tea|beer|wine|drink|cola|lemonade)/i.test(name)) {
      return 'Beverages'
    }
    // Snacks & Chips
    if (/(chip|crisp|popcorn|pretzel|cracker|snack)/i.test(name)) {
      return 'Snacks & Chips'
    }
    // Frozen Foods
    if (/(frozen|ice cream|popsicle)/i.test(name)) {
      return 'Frozen Foods'
    }
    // Condiments & Sauces
    if (/(sauce|ketchup|mustard|mayo|dressing|vinegar|oil|condiment)/i.test(name)) {
      return 'Condiments & Sauces'
    }
    
    // Default category
    return 'Pantry & Dry Goods'
  }

  const handleVoiceInput = (transcript: string) => {
    // Capitalize first letter of each word
    const productName = transcript
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    
    const category = categorizeProduct(productName)
    
    // Format timestamp for display
    const now = new Date()
    const timestamp = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    
    addProductToPicklist({
      name: productName,
      category,
      quantity: 1,
      unit: 'unit',
      source: 'voice',
      details: {
        notes: `Added via voice on ${timestamp}`
      }
    })
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()

    addProductToPicklist({
      name: formData.name,
      category: formData.category,
      quantity: parseFloat(formData.quantity) || 1,
      unit: formData.unit,
      details: formData.notes ? { notes: formData.notes } : undefined,
    })

    // Reset form
    setFormData({
      name: '',
      category: 'Pantry & Dry Goods',
      quantity: '1',
      unit: 'unit',
      notes: '',
    })
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title={t('pickList')} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              {filteredProducts.length} of {picklistProducts.length} {picklistProducts.length === 1 ? t('product') : t('products')}
            </p>
            {picklistProducts.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-sm text-red-600 hover:text-red-700 font-medium underline"
              >
                Clear List
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder={t('searchProducts')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <VoiceInput onTranscript={handleVoiceInput} />
            <Button 
              onClick={() => setIsUploadModalOpen(true)} 
              variant="secondary"
              title={t('uploadImages')}
              className="sm:px-4"
            >
              <Upload className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">{t('uploadImages')}</span>
            </Button>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              variant="secondary"
              title={t('addProduct')}
              className="sm:px-4"
            >
              <Plus className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">{t('addProduct')}</span>
            </Button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-4 overflow-x-auto scrollbar-desktop-only">
          <div className="flex gap-2 pt-2 pb-2 min-w-max">
            {categories.map((category) => {
              const count = category === 'All' ? picklistProducts.length : (categoryCounts[category] || 0)
              const displayName = category === 'All' ? t('all') : t(`categories.${category}`)
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  {displayName}
                  <span className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                    selectedCategory === category
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-900 text-white'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Source Filter - Compact Icon Row */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Source:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSources(new Set())}
              className={`p-2 rounded-lg transition-all duration-200 active:scale-95 ${
                selectedSources.size === 0
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:shadow-sm'
              }`}
              title="All sources"
            >
              <span className="text-sm font-medium">All</span>
            </button>
            <button
              onClick={() => {
                const newSet = new Set(selectedSources)
                if (newSet.has('voice')) {
                  newSet.delete('voice')
                } else {
                  newSet.add('voice')
                }
                setSelectedSources(newSet)
              }}
              className={`p-2 rounded-lg transition-all duration-200 active:scale-95 ${
                selectedSources.has('voice')
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-indigo-600 border border-gray-300 hover:border-indigo-300 hover:shadow-sm'
              }`}
              title="Voice input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const newSet = new Set(selectedSources)
                if (newSet.has('shopping_list')) {
                  newSet.delete('shopping_list')
                } else {
                  newSet.add('shopping_list')
                }
                setSelectedSources(newSet)
              }}
              className={`p-2 rounded-lg transition-all duration-200 active:scale-95 ${
                selectedSources.has('shopping_list')
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-blue-600 border border-gray-300 hover:border-blue-300 hover:shadow-sm'
              }`}
              title="Receipt"
            >
              <Receipt className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const newSet = new Set(selectedSources)
                if (newSet.has('product')) {
                  newSet.delete('product')
                } else {
                  newSet.add('product')
                }
                setSelectedSources(newSet)
              }}
              className={`p-2 rounded-lg transition-colors ${
                selectedSources.has('product')
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-600 border border-gray-300 hover:border-gray-400'
              }`}
              title="Product image"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const newSet = new Set(selectedSources)
                if (newSet.has('fridge')) {
                  newSet.delete('fridge')
                } else {
                  newSet.add('fridge')
                }
                setSelectedSources(newSet)
              }}
              className={`p-2 rounded-lg transition-colors ${
                selectedSources.has('fridge')
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-600 border border-gray-300 hover:border-gray-400'
              }`}
              title="Fridge"
            >
              <Refrigerator className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const newSet = new Set(selectedSources)
                if (newSet.has('dish')) {
                  newSet.delete('dish')
                } else {
                  newSet.add('dish')
                }
                setSelectedSources(newSet)
              }}
              className={`p-2 rounded-lg transition-colors ${
                selectedSources.has('dish')
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-orange-600 border border-gray-300 hover:border-gray-400'
              }`}
              title="Dish"
            >
              <UtensilsCrossed className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const newSet = new Set(selectedSources)
                if (newSet.has('recipe')) {
                  newSet.delete('recipe')
                } else {
                  newSet.add('recipe')
                }
                setSelectedSources(newSet)
              }}
              className={`p-2 rounded-lg transition-colors ${
                selectedSources.has('recipe')
                  ? 'bg-pink-600 text-white'
                  : 'bg-white text-pink-600 border border-gray-300 hover:border-gray-400'
              }`}
              title="Recipe"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid - Add padding bottom to prevent content being hidden behind fixed bar */}
        {filteredProducts.length === 0 ? (
          <div className={shoppingListCount > 0 ? "pb-24" : ""}>
            {/* Empty State Message */}
            <div className="text-center py-8 mb-8">
              <p className="text-gray-900 text-lg font-medium mb-2">Start Building Your Picklist</p>
              <p className="text-gray-600 mb-6">
                Upload an image of your fridge, pantry, or receipt, or add products manually to populate your picklist
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setIsUploadModalOpen(true)}>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Images
                </Button>
                <Button onClick={() => setIsModalOpen(true)} variant="secondary">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Dummy Product Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 opacity-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 ${shoppingListCount > 0 ? "pb-24" : ""}`}>
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-slide-up"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  opacity: 0
                }}
              >
                <ProductCard
                  product={product}
                  onToggle={toggleProductInPicklist}
                  onDelete={deleteProductFromPicklist}
                  onUpdate={updateProductInPicklist}
                />
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Bottom Action Bar - Outside main, truly fixed to viewport */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {shoppingListCount > 0 && (
            <div className="text-base text-gray-600">
              <span className="font-semibold text-gray-900">{shoppingListCount}</span>{' '}
              {shoppingListCount === 1 ? t('itemInShoppingList') : t('itemsInShoppingList')}
            </div>
          )}
          <Button onClick={() => router.push('/app/shopping-list')} size="lg" className={shoppingListCount === 0 ? 'w-full' : ''}>
            View Shopping Lists
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('addProductManually')}
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <Input
            label={t('productName')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder={t('productNamePlaceholder')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {t('category')} <span className="text-gray-500 ml-1">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as ProductCategory })
              }
              className="w-full h-11 px-4 text-base border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
            >
              <option value="Fresh Produce">{t('categories.Fresh Produce')}</option>
              <option value="Meat & Seafood">{t('categories.Meat & Seafood')}</option>
              <option value="Dairy & Eggs">{t('categories.Dairy & Eggs')}</option>
              <option value="Bakery & Bread">{t('categories.Bakery & Bread')}</option>
              <option value="Frozen Foods">{t('categories.Frozen Foods')}</option>
              <option value="Pantry & Dry Goods">{t('categories.Pantry & Dry Goods')}</option>
              <option value="Canned & Jarred Foods">{t('categories.Canned & Jarred Foods')}</option>
              <option value="Snacks & Chips">{t('categories.Snacks & Chips')}</option>
              <option value="Candy & Chocolate">{t('categories.Candy & Chocolate')}</option>
              <option value="Beverages">{t('categories.Beverages')}</option>
              <option value="Wine & Spirits">{t('categories.Wine & Spirits')}</option>
              <option value="Breakfast & Cereals">{t('categories.Breakfast & Cereals')}</option>
              <option value="Deli & Prepared Foods">{t('categories.Deli & Prepared Foods')}</option>
              <option value="Condiments & Sauces">{t('categories.Condiments & Sauces')}</option>
              <option value="Baking Supplies">{t('categories.Baking Supplies')}</option>
              <option value="Health & Wellness">{t('categories.Health & Wellness')}</option>
              <option value="Baby Products">{t('categories.Baby Products')}</option>
              <option value="Pet Supplies">{t('categories.Pet Supplies')}</option>
              <option value="Personal Care & Beauty">{t('categories.Personal Care & Beauty')}</option>
              <option value="Household & Cleaning">{t('categories.Household & Cleaning')}</option>
              <option value="Kitchen & Dining">{t('categories.Kitchen & Dining')}</option>
              <option value="Home & Garden">{t('categories.Home & Garden')}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('quantity')}
              type="number"
              step="0.1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {t('unit')} <span className="text-gray-500 ml-1">*</span>
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as Unit })}
                className="w-full h-11 px-4 text-base border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
              >
                <option value="unit">unit</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="dozen">dozen</option>
                <option value="bunch">bunch</option>
                <option value="package">package</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">{t('notesOptional')}</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('notesPlaceholder')}
              rows={3}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {t('addProduct')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Clear List Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear All Products?</h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete all {picklistProducts.length} products from your picklist. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <button
                onClick={() => {
                  clearAllPicklistProducts()
                  setShowClearConfirm(false)
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
