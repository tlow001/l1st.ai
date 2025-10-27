'use client'

import { useState } from 'react'
import { Product, ProductCategory, Unit } from '@/types'
import { useTranslation } from '@/lib/i18n'
import { Checkbox } from './Checkbox'
import { ChevronDown, ChevronUp, Edit2, Trash2, Receipt, Image, Refrigerator, UtensilsCrossed, BookOpen, Mic, Check, X } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Product>) => void
}

export function ProductCard({ product, onToggle, onDelete, onUpdate }: ProductCardProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: product.name,
    category: product.category,
    quantity: product.quantity.toString(),
    unit: product.unit,
    price: product.details?.price || '',
    notes: product.details?.notes || ''
  })

  const getCategoryColor = (category: ProductCategory) => {
    const colors: Record<ProductCategory, string> = {
      'Fresh Produce': 'bg-green-50 text-green-700 border-green-200',
      'Meat & Seafood': 'bg-red-50 text-red-700 border-red-200',
      'Dairy & Eggs': 'bg-blue-50 text-blue-700 border-blue-200',
      'Bakery & Bread': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Frozen Foods': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Pantry & Dry Goods': 'bg-orange-50 text-orange-700 border-orange-200',
      'Canned & Jarred Foods': 'bg-amber-50 text-amber-700 border-amber-200',
      'Snacks & Chips': 'bg-pink-50 text-pink-700 border-pink-200',
      'Candy & Chocolate': 'bg-rose-50 text-rose-700 border-rose-200',
      'Beverages': 'bg-teal-50 text-teal-700 border-teal-200',
      'Wine & Spirits': 'bg-violet-50 text-violet-700 border-violet-200',
      'Breakfast & Cereals': 'bg-amber-50 text-amber-700 border-amber-200',
      'Deli & Prepared Foods': 'bg-orange-50 text-orange-700 border-orange-200',
      'Condiments & Sauces': 'bg-lime-50 text-lime-700 border-lime-200',
      'Baking Supplies': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Health & Wellness': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Baby Products': 'bg-sky-50 text-sky-700 border-sky-200',
      'Pet Supplies': 'bg-slate-50 text-slate-700 border-slate-200',
      'Personal Care & Beauty': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
      'Household & Cleaning': 'bg-purple-50 text-purple-700 border-purple-200',
      'Kitchen & Dining': 'bg-gray-50 text-gray-700 border-gray-200',
      'Home & Garden': 'bg-green-50 text-green-700 border-green-200',
    }
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const handleDelete = () => {
    onDelete(product.id)
  }

  const handleEdit = () => {
    setEditForm({
      name: product.name,
      category: product.category,
      quantity: product.quantity.toString(),
      unit: product.unit,
      price: product.details?.price || '',
      notes: product.details?.notes || ''
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    onUpdate(product.id, {
      name: editForm.name,
      category: editForm.category,
      quantity: parseFloat(editForm.quantity) || 1,
      unit: editForm.unit,
      details: {
        ...product.details,
        price: editForm.price || undefined,
        notes: editForm.notes || undefined
      }
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const getSourceInfo = (source?: string) => {
    switch (source) {
      case 'shopping_list':
        return { icon: Receipt, label: t('receipt'), color: 'text-blue-600' }
      case 'product':
        return { icon: Image, label: t('productImage'), color: 'text-green-600' }
      case 'fridge':
        return { icon: Refrigerator, label: t('fridge'), color: 'text-purple-600' }
      case 'dish':
        return { icon: UtensilsCrossed, label: t('dish'), color: 'text-orange-600' }
      case 'recipe':
        return { icon: BookOpen, label: t('recipe'), color: 'text-pink-600' }
      case 'voice':
        return { icon: Mic, label: t('voiceInputSource'), color: 'text-indigo-600' }
      default:
        return null
    }
  }

  const sourceInfo = getSourceInfo(product.source)

  if (isEditing) {
    return (
      <div className="bg-white border-2 border-gray-900 rounded-lg p-4 shadow-md">
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value as ProductCategory })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors"
            >
              <option value="Fresh Produce">{t('categories.Fresh Produce')}</option>
              <option value="Meat & Seafood">{t('categories.Meat & Seafood')}</option>
              <option value="Dairy & Eggs">{t('categories.Dairy & Eggs')}</option>
              <option value="Bakery & Bread">{t('categories.Bakery & Bread')}</option>
              <option value="Frozen Foods">{t('categories.Frozen Foods')}</option>
              <option value="Pantry & Dry Goods">{t('categories.Pantry & Dry Goods')}</option>
              <option value="Beverages">{t('categories.Beverages')}</option>
              <option value="Snacks & Chips">{t('categories.Snacks & Chips')}</option>
              <option value="Household & Cleaning">{t('categories.Household & Cleaning')}</option>
            </select>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                step="0.1"
                value={editForm.quantity}
                onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={editForm.unit}
                onChange={(e) => setEditForm({ ...editForm, unit: e.target.value as Unit })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors"
              >
                <option value="unit">unit</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="dozen">dozen</option>
                <option value="bunch">bunch</option>
                <option value="package">package</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (e.g., €3.99)</label>
            <input
              type="text"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              placeholder="€0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-colors"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent resize-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/90 active:bg-primary-purple/80 transition-all hover:shadow-md active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start gap-4">
        <Checkbox
          checked={product.inShoppingList}
          onChange={() => onToggle(product.id)}
          size="md"
          aria-label={`Add ${product.name} to shopping list`}
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(product.category)}`}>
              {t(`categories.${product.category}`)}
            </span>
            <span>
              {product.quantity} {product.unit}
            </span>
            {product.details?.price && (
              <span className="text-gray-900 font-medium">
                {product.details.price}
              </span>
            )}
            {sourceInfo && (
              <span className={`flex items-center gap-1 px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-xs font-medium ${sourceInfo.color}`}>
                <sourceInfo.icon className="w-3 h-3" />
                {sourceInfo.label}
              </span>
            )}
          </div>

          {/* Expanded Details */}
          {expanded && product.details && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
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
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Edit product"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          {product.details && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={expanded ? 'Collapse details' : 'Expand details'}
            >
              {expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
            aria-label={`Delete ${product.name}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
