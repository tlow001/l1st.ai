import { ImageValidationResponse, ImageType } from '@/types'

/**
 * Compress and resize image if needed
 */
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Calculate new dimensions (max 1920px on longest side)
        const maxSize = 1920
        let width = img.width
        let height = img.height

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize
            width = maxSize
          } else {
            width = (width / height) * maxSize
            height = maxSize
          }
        }

        // Create canvas and compress
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to base64 with compression (0.8 quality for JPEG)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        resolve(compressedDataUrl)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Extract products from an image using OpenAI Vision API
 * The AI will automatically detect the image type
 */
export async function extractProductsFromImage(
  file: File
): Promise<ImageValidationResponse> {
  try {
    // Compress and convert image to base64
    console.log('Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB')
    const base64Image = await compressImage(file)
    console.log('Compressed size:', (base64Image.length / 1024 / 1024).toFixed(2), 'MB')
    
    // Check if compressed image is still too large (max 5MB base64)
    const maxBase64Size = 5 * 1024 * 1024
    if (base64Image.length > maxBase64Size) {
      return {
        valid: false,
        message: 'Image is too complex to process. Please try a simpler or smaller image.',
        products: [],
      }
    }

    // Call the API with longer timeout (2 minutes to match server)
    console.log('[Client] Starting fetch to /api/extract-products')
    console.log('[Client] AI will auto-detect image type')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log('[Client] Request timed out after 180 seconds')
      controller.abort()
    }, 180000) // 180 second timeout (3 minutes)

    try {
      const response = await fetch('/api/extract-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
        signal: controller.signal,
      })
      
      console.log('[Client] Fetch completed, status:', response.status)

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage = 'Failed to process image'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage)
      }

      const result: ImageValidationResponse = await response.json()
      console.log('[Client] Parsed response:', result.valid, result.products.length, 'products')
      return result
    } catch (fetchError: any) {
      console.log('[Client] Fetch error:', fetchError.name, fetchError.message)
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error: any) {
    console.error('Error extracting products:', error)

    
    // Handle specific error types
    if (error.name === 'AbortError') {
      return {
        valid: false,
        message: 'Request timed out. The image may be too complex or the server is busy. Please try again.',
        products: [],
      }
    }
    
    if (error.message.includes('fetch')) {
      return {
        valid: false,
        message: 'Network error. Please check your connection and try again.',
        products: [],
      }
    }

    return {
      valid: false,
      message: error.message || 'An error occurred while processing the image. Please try again.',
      products: [],
    }
  }
}
