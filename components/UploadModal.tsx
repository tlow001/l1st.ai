'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Modal } from './Modal'
import { Button } from './Button'
import { UploadedImage } from '@/types'
import { useStore } from '@/store'
import { mockAIExtraction } from '@/lib/mockData'
import { Upload, X, Sparkles } from 'lucide-react'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [processing, setProcessing] = useState(false)

  const { addImage, addProduct, useCredits, credits } = useStore()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    onDrop: (acceptedFiles) => {
      const newImages: UploadedImage[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        file,
        preview: URL.createObjectURL(file),
        processed: false,
      }))
      setImages((prev) => [...prev, ...newImages])
    },
  })

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setImages([])
      setProcessing(false)
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview))
    }
  }, [images])

  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const handleProcess = async () => {
    const cost = images.length * 5

    if (credits < cost) {
      alert(`Insufficient credits. You need ${cost} credits but only have ${credits}.`)
      return
    }

    if (!useCredits(cost)) {
      return
    }

    setProcessing(true)

    try {
      // Process each image with AI
      for (const img of images) {
        const products = await mockAIExtraction()
        products.forEach((product) => {
          addProduct(product)
        })
        addImage({ ...img, processed: true })
      }

      // Cleanup
      images.forEach((img) => URL.revokeObjectURL(img.preview))

      // Close modal and notify success
      onSuccess?.()
      onClose()
    } catch (error) {
      alert('An error occurred during processing. Please try again.')
      setProcessing(false)
    }
  }

  const handleClose = () => {
    // Cleanup image URLs
    images.forEach((img) => URL.revokeObjectURL(img.preview))
    setImages([])
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Images">
      <div className="space-y-6">
        {/* AI Info */}
        <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg border border-gray-200">
          <Sparkles className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">
              Upload images of your <strong>fridge</strong>, <strong>receipts</strong>,{' '}
              <strong>dishes</strong>, <strong>recipes</strong>, or <strong>products</strong>.
              Our AI will automatically detect and extract items.
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-gray-900 bg-gray-100'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">
            Drag & drop images here, or click to select
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: PNG, JPG, JPEG, WebP
          </p>
        </div>

        {/* Preview Grid */}
        {images.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Preview ({images.length} {images.length === 1 ? 'image' : 'images'})
            </h3>
            <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group aspect-square rounded overflow-hidden bg-gray-100 border border-gray-200"
                >
                  <img
                    src={image.preview}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {images.length > 0 && (
              <>
                Cost:{' '}
                <span className="font-semibold text-gray-900">{images.length * 5}</span>{' '}
                credits
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleProcess}
              loading={processing}
              disabled={images.length === 0 || credits < images.length * 5}
            >
              Process with AI
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
