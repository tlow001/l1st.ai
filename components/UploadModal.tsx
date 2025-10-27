'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Modal } from './Modal'
import { Button } from './Button'
import { UploadedImage, ImageType } from '@/types'
import { useStore } from '@/store'
import { useTranslation } from '@/lib/i18n'
import { extractProductsFromImage } from '@/lib/openaiExtraction'
import { Upload, X, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ImageWithStatus extends UploadedImage {
  status: 'pending' | 'processing' | 'success' | 'error'
  message?: string
  productCount?: number
}

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
  const [images, setImages] = useState<ImageWithStatus[]>([])
  const [processing, setProcessing] = useState(false)
  const { t } = useTranslation()

  const { addImage, addProduct, useCredits, credits } = useStore()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    onDrop: (acceptedFiles) => {
      const newImages: ImageWithStatus[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        file,
        preview: URL.createObjectURL(file),
        processed: false,
        status: 'pending',
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
    setProcessing(true)

    let successCount = 0
    let totalProductsAdded = 0

    try {
      // Process each image individually
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        
        // Update status to processing
        setImages((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: 'processing' } : item
          )
        )

        try {
          // Extract products using OpenAI (AI will auto-detect image type)
          const result = await extractProductsFromImage(img.file)

          if (result.valid && result.products.length > 0) {
            // Add products to store
            result.products.forEach((product) => {
              addProduct(product)
            })

            // Update status to success
            setImages((prev) =>
              prev.map((item, idx) =>
                idx === i
                  ? {
                      ...item,
                      status: 'success',
                      message: result.message,
                      productCount: result.products.length,
                      processed: true,
                    }
                  : item
              )
            )

            // Add image to store (products already have correct source from AI)
            addImage({ ...img, processed: true })
            
            successCount++
            totalProductsAdded += result.products.length
          } else {
            // Invalid or no products found
            setImages((prev) =>
              prev.map((item, idx) =>
                idx === i
                  ? {
                      ...item,
                      status: 'error',
                      message: result.message || 'No products detected in this image',
                    }
                  : item
              )
            )
          }
        } catch (error: any) {
          // Error processing this image
          setImages((prev) =>
            prev.map((item, idx) =>
              idx === i
                ? {
                    ...item,
                    status: 'error',
                    message: error.message || 'Failed to process image',
                  }
                : item
            )
          )
        }
      }

      // Charge credits only for successfully processed images
      if (successCount > 0) {
        const cost = successCount * 5
        useCredits(cost)
      }

      // Show summary
      if (successCount > 0) {
        setTimeout(() => {
          onSuccess?.()
          onClose()
        }, 2000)
      }
    } catch (error) {
      console.error('Error processing images:', error)
    } finally {
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
    <Modal isOpen={isOpen} onClose={handleClose} title={t('uploadImagesTitle')}>
      <div className="space-y-6">
        {/* AI Info */}
        <div className="flex items-start gap-3 p-3 bg-gray-100 rounded-lg border border-gray-200">
          <Sparkles className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">
              {t('uploadAnyImage')} <strong>{t('automaticallyDetect')}</strong> {t('imageTypeDescription')}
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
            {t('dragDropImages')}
          </p>
          <p className="text-xs text-gray-500">
            {t('supportedFormats')}
          </p>
        </div>

        {/* Preview Grid with Status */}
        {images.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              {images.length} {images.length === 1 ? t('image') : t('images')}
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                >
                  {/* Image Preview */}
                  <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    <img
                      src={image.preview}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Status and Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {image.status === 'pending' && (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                      {image.status === 'processing' && (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      )}
                      {image.status === 'success' && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {image.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {image.file.name}
                      </span>
                    </div>
                    
                    {image.status === 'pending' && (
                      <p className="text-xs text-gray-500">{t('readyToProcess')}</p>
                    )}
                    {image.status === 'processing' && (
                      <p className="text-xs text-blue-600">{t('analyzingImage')}</p>
                    )}
                    {image.status === 'success' && image.productCount && (
                      <p className="text-xs text-green-600">
                        ✓ {t('addedProducts')} {image.productCount} {image.productCount === 1 ? t('product') : t('products')}
                      </p>
                    )}
                    {image.status === 'error' && image.message && (
                      <p className="text-xs text-red-600">{image.message}</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  {!processing && (
                    <button
                      onClick={() => removeImage(image.id)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {images.length > 0 && !processing && (
              <>
                {t('estimatedCost')}:{' '}
                <span className="font-semibold text-gray-900">{images.length * 5}</span>{' '}
                {t('credits')}
              </>
            )}
            {processing && (
              <span className="text-blue-600">{t('processingImages')}</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={processing}>
              {processing ? t('closeWhenDone') : t('cancel')}
            </Button>
            <Button
              onClick={handleProcess}
              loading={processing}
              disabled={images.length === 0 || processing}
            >
              {t('processWithAI')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
