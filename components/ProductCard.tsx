'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { Checkbox } from './Checkbox'
import { ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function ProductCard({ product, onToggle, onDelete }: ProductCardProps) {
  const [expanded, setExpanded] = useState(false)

  const handleDelete = () => {
    if (confirm(`Delete ${product.name}?`)) {
      onDelete(product.id)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
              {product.category}
            </span>
            <span>
              {product.quantity} {product.unit}
            </span>
          </div>

          {/* Expanded Details */}
          {expanded && product.details && (
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
