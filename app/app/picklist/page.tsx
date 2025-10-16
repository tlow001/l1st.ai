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
import { useStore } from '@/store'
import { useAuthGuard } from '@/lib/authGuard'
import { ProductCategory, Unit } from '@/types'
import { Plus, Search, CheckCircle2, Circle, Upload } from 'lucide-react'

export default function PicklistPage() {
  useAuthGuard()
  const router = useRouter()
  const { products, toggleProductInList, deleteProduct, addProduct } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Other' as ProductCategory,
    quantity: '1',
    unit: 'unit' as Unit,
    notes: '',
  })

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [products, searchQuery])

  const selectionStats = useMemo(() => {
    const total = products.length
    const selected = products.filter((p) => p.inShoppingList).length
    const remaining = total - selected
    const percentage = total > 0 ? Math.round((selected / total) * 100) : 0

    return { total, selected, remaining, percentage }
  }, [products])

  const shoppingListCount = selectionStats.selected

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()

    addProduct({
      name: formData.name,
      category: formData.category,
      quantity: parseFloat(formData.quantity) || 1,
      unit: formData.unit,
      details: formData.notes ? { notes: formData.notes } : undefined,
    })

    // Reset form
    setFormData({
      name: '',
      category: 'Other',
      quantity: '1',
      unit: 'unit',
      notes: '',
    })
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Pick List" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsUploadModalOpen(true)} variant="secondary">
              <Upload className="w-5 h-5 mr-2" />
              Upload Images
            </Button>
            <Button onClick={() => setIsModalOpen(true)} variant="secondary">
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Selection Stats Visualization */}
        {products.length > 0 && (
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900">Selection Progress</h3>
              <span className="text-sm text-gray-600">
                {selectionStats.percentage}% selected
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all duration-300"
                style={{ width: `${selectionStats.percentage}%` }}
              />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-900">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">{selectionStats.selected}</span>
                  <span className="text-gray-600">Selected</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Circle className="w-4 h-4" />
                  <span className="font-medium">{selectionStats.remaining}</span>
                  <span className="text-gray-600">Remaining</span>
                </div>
              </div>
              <div className="text-gray-600">
                {selectionStats.selected} of {selectionStats.total} products
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="w-5 h-5 mr-2" />
              Upload Images
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggle={toggleProductInList}
                onDelete={deleteProduct}
              />
            ))}
          </div>
        )}

        {/* Bottom Action Bar */}
        {shoppingListCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-base text-gray-600">
                <span className="font-semibold text-gray-900">{shoppingListCount}</span>{' '}
                {shoppingListCount === 1 ? 'item' : 'items'} in shopping list
              </div>
              <Button onClick={() => router.push('/app/shopping-list')} size="lg">
                View Shopping List
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Product Manually"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., Whole Milk"
          />

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Category <span className="text-gray-500 ml-1">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as ProductCategory })
              }
              className="w-full h-11 px-4 text-base border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
            >
              <option value="Dairy">Dairy</option>
              <option value="Bakery">Bakery</option>
              <option value="Meat">Meat</option>
              <option value="Produce">Produce</option>
              <option value="Pantry">Pantry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              step="0.1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Unit <span className="text-gray-500 ml-1">*</span>
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
            <label className="block text-sm font-medium text-gray-900 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes..."
              rows={3}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
