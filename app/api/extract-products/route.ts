import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ImageValidationResponse, ProductCategory, ImageSource } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const VALID_CATEGORIES: ProductCategory[] = [
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

// Increase API route timeout to 2 minutes
export const maxDuration = 120 // seconds

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('[API] ========== REQUEST START ==========')
  console.log('[API] Timestamp:', new Date().toISOString())
  
  try {
    const { image } = await request.json()
    const parseTime = Date.now() - startTime
    console.log('[API] Request parsed in', parseTime, 'ms')
    console.log('[API] Image size:', (image?.length / 1024).toFixed(2), 'KB')

    if (!image) {
      console.log('[API] Missing required field: image')
      return NextResponse.json(
        { error: 'Missing required field: image' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('[API] OpenAI API key is missing!')
      return NextResponse.json(
        {
          valid: false,
          message: 'OpenAI API key is not configured. Please contact support.',
          products: [],
        } as ImageValidationResponse,
        { status: 500 }
      )
    }

    // Create the system message for JSON schema
    const systemPrompt = `You are a grocery product extraction AI. Analyze images and extract products into valid JSON format.

Response must be a JSON object with:
- valid: boolean (true if image contains groceries/food/household items)
- message: string (brief description)
- imageType: string (detected type: fridge, product, shopping_list, dish, or recipe)
- products: array of objects with: name, category, quantity, unit, source, details (with price and notes)

Valid categories: ${VALID_CATEGORIES.join(', ')}
Valid units: lb, oz, kg, g, ml, l, unit, dozen, bunch, package
Valid sources: fridge, product, shopping_list, dish, recipe (match detected imageType)`

    // Create the user prompt
    const userPrompt = `Analyze this image and first determine what type it is:
- fridge: Photo of refrigerator/pantry contents
- product: Close-up of individual grocery items
- shopping_list: Receipt or shopping list
- dish: Prepared meal/dish
- recipe: Recipe card/cookbook page

Then extract ALL visible grocery/food/household products.

For receipts: include prices
For quantities: use realistic estimates
Choose most specific category
Set source to match the detected imageType
If not a relevant image, set valid=false and explain why

Return JSON with valid, message, imageType, and products array.`

    const openaiStartTime = Date.now()
    console.log('[API] ========== CALLING OPENAI ==========')
    console.log('[API] Timestamp:', new Date().toISOString())
    
    // Call OpenAI Vision API with JSON mode
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPrompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
      temperature: 0.2,
    })

    const openaiDuration = Date.now() - openaiStartTime
    console.log('[API] ========== OPENAI RESPONDED ==========')
    console.log('[API] OpenAI took', openaiDuration, 'ms (', (openaiDuration / 1000).toFixed(2), 'seconds )')
    console.log('[API] Timestamp:', new Date().toISOString())
    
    // Parse the response
    const content = response.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Failed to process image',
          products: [],
        } as ImageValidationResponse,
        { status: 500 }
      )
    }

    // Parse JSON response - handle markdown wrapping
    let result: ImageValidationResponse
    try {
      // Remove markdown code blocks if present
      let cleanContent = content.trim()
      cleanContent = cleanContent.replace(/^```json\s*/gm, '').replace(/^```\s*/gm, '')
      cleanContent = cleanContent.replace(/```$/gm, '')
      
      result = JSON.parse(cleanContent)
    } catch (parseError: any) {
      console.error('Failed to parse OpenAI response:', content.substring(0, 500))
      console.error('Parse error:', parseError)
      
      // Try to salvage partial response
      try {
        let cleanContent = content.trim()
        cleanContent = cleanContent.replace(/^```json\s*/gm, '').replace(/^```\s*/gm, '').replace(/```$/gm, '')
        
        // Find the last complete closing brace for the products array
        const lastBracketPos = cleanContent.lastIndexOf(']')
        if (lastBracketPos > 0) {
          // Try to extract a valid JSON by finding matching braces
          const truncated = cleanContent.substring(0, lastBracketPos + 1)
          
          // Count braces to ensure we have proper closure
          let braceCount = 0
          let validJson = ''
          for (let i = 0; i < truncated.length; i++) {
            const char = truncated[i]
            validJson += char
            if (char === '{') braceCount++
            if (char === '}') braceCount--
          }
          
          // Add missing closing braces
          while (braceCount > 0) {
            validJson += '}'
            braceCount--
          }
          
          result = JSON.parse(validJson)
        } else {
          throw parseError
        }
      } catch (salvageError) {
        console.error('Salvage attempt failed:', salvageError)
        return NextResponse.json(
          {
            valid: false,
            message: 'The response was too large or complex. Some items may have been missed. Try uploading a clearer image or contact support.',
            products: [],
          } as ImageValidationResponse,
          { status: 500 }
        )
      }
    }

    // Validate the response structure
    if (typeof result.valid !== 'boolean' || !Array.isArray(result.products)) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Invalid response format from AI',
          products: [],
        } as ImageValidationResponse,
        { status: 500 }
      )
    }

    // Extract the detected image type from AI response or use default
    const detectedImageType = (result as any).imageType as ImageSource
    const source: ImageSource = ['fridge', 'product', 'shopping_list', 'dish', 'recipe'].includes(detectedImageType)
      ? detectedImageType
      : 'product' // default fallback

    console.log('[API] Detected image type:', source)

    // Validate and clean product data
    result.products = result.products
      .filter((product) => product.name && product.category && product.quantity)
      .map((product) => ({
        ...product,
        source: product.source || source, // Use product's source if provided, otherwise use detected
        quantity: Number(product.quantity) || 1,
        unit: product.unit || 'unit',
        category: VALID_CATEGORIES.includes(product.category as ProductCategory)
          ? (product.category as ProductCategory)
          : 'Pantry & Dry Goods',
      }))

    const totalDuration = Date.now() - startTime
    console.log('[API] ========== REQUEST COMPLETE ==========')
    console.log('[API] Total processing time:', totalDuration, 'ms (', (totalDuration / 1000).toFixed(2), 'seconds )')
    console.log('[API] Returning', result.products.length, 'products')
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[API] Error processing image:', error)
    console.error('[API] Error stack:', error.stack)
    
    // Handle specific OpenAI errors
    if (error?.status === 429) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Rate limit reached. Please try again in a moment.',
          products: [],
        } as ImageValidationResponse,
        { status: 429 }
      )
    }

    return NextResponse.json(
      {
        valid: false,
        message: 'An error occurred while processing the image. Please try again.',
        products: [],
      } as ImageValidationResponse,
      { status: 500 }
    )
  }
}
