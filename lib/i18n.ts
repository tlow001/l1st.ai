import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'nl'

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-preference',
      skipHydration: true,
    }
  )
)

export const translations = {
  en: {
    // Header
    appName: 'L1st.ai',
    download: 'Download',
    launchApp: 'Launch App',
    
    // Navigation
    pickList: 'Pick List',
    shoppingList: 'Shopping List',
    
    // Auth
    login: 'Log In',
    logout: 'Log Out',
    register: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    continueWith: 'Or continue with',
    signInWithGoogle: 'Sign in with Google',
    signUpWithGoogle: 'Sign up with Google',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    
    // Picklist page
    products: 'products',
    product: 'product',
    estimatedCost: 'Estimated cost',
    credits: 'credits',
    searchProducts: 'Search products...',
    voiceInput: 'Voice Input',
    listening: 'Listening...',
    uploadImages: 'Upload Images',
    addProduct: 'Add Product',
    all: 'All',
    
    // Selection stats
    selectionProgress: 'Selection Progress',
    selected: 'Selected',
    remaining: 'Remaining',
    
    // Empty state
    startBuildingPicklist: 'Start Building Your Picklist',
    uploadOrAddManually: 'Upload an image of your fridge, pantry, or receipt, or add products manually to populate your picklist',
    
    // Product card
    price: 'Price',
    nutrition: 'Nutrition',
    alternatives: 'Alternatives',
    notes: 'Notes',
    delete: 'Delete',
    expandDetails: 'Expand details',
    collapseDetails: 'Collapse details',
    
    // Sources
    receipt: 'Receipt',
    productImage: 'Product Image',
    fridge: 'Fridge',
    dish: 'Dish',
    recipe: 'Recipe',
    voiceInputSource: 'Voice Input',
    
    // Upload modal
    uploadImagesTitle: 'Upload Images',
    uploadAnyImage: 'Upload any grocery-related image! Our AI will',
    automaticallyDetect: 'automatically detect',
    imageTypeDescription: "whether it's a fridge, receipt, dish, recipe, or product photo and extract all items accordingly.",
    dragDropImages: 'Drag & drop images here, or click to select',
    supportedFormats: 'Supported formats: PNG, JPG, JPEG, WebP',
    images: 'images',
    image: 'image',
    readyToProcess: 'Ready to process',
    analyzingImage: 'Analyzing image...',
    addedProducts: 'Added',
    processingImages: 'Processing images...',
    closeWhenDone: 'Close when done',
    cancel: 'Cancel',
    processWithAI: 'Process with AI',
    
    // Add product modal
    addProductManually: 'Add Product Manually',
    productName: 'Product Name',
    productNamePlaceholder: 'e.g., Whole Milk',
    category: 'Category',
    quantity: 'Quantity',
    unit: 'Unit',
    notesOptional: 'Notes',
    notesPlaceholder: 'Optional notes...',
    
    // Categories
    categories: {
      'Fresh Produce': 'Fresh Produce',
      'Meat & Seafood': 'Meat & Seafood',
      'Dairy & Eggs': 'Dairy & Eggs',
      'Bakery & Bread': 'Bakery & Bread',
      'Frozen Foods': 'Frozen Foods',
      'Pantry & Dry Goods': 'Pantry & Dry Goods',
      'Canned & Jarred Foods': 'Canned & Jarred Foods',
      'Snacks & Chips': 'Snacks & Chips',
      'Candy & Chocolate': 'Candy & Chocolate',
      'Beverages': 'Beverages',
      'Wine & Spirits': 'Wine & Spirits',
      'Breakfast & Cereals': 'Breakfast & Cereals',
      'Deli & Prepared Foods': 'Deli & Prepared Foods',
      'Condiments & Sauces': 'Condiments & Sauces',
      'Baking Supplies': 'Baking Supplies',
      'Health & Wellness': 'Health & Wellness',
      'Baby Products': 'Baby Products',
      'Pet Supplies': 'Pet Supplies',
      'Personal Care & Beauty': 'Personal Care & Beauty',
      'Household & Cleaning': 'Household & Cleaning',
      'Kitchen & Dining': 'Kitchen & Dining',
      'Home & Garden': 'Home & Garden',
    },
    
    // Bottom bar
    itemsInShoppingList: 'items in shopping list',
    itemInShoppingList: 'item in shopping list',
    viewShoppingList: 'View Shopping List',
    
    // Shopping list page
    myShoppingList: 'My Shopping List',
    sortBy: 'Sort by',
    addedOrder: 'Added Order',
    checkOffOrder: 'Check-off Order',
    alphabetical: 'Alphabetical',
    backToPicklist: 'Back to Picklist',
    checkedOff: 'Checked Off',
    downloadList: 'Download List',
    clearChecked: 'Clear Checked',
    startShopping: 'Start Shopping',
    estimatedTotal: 'Estimated total',
    itemsWithPrices: 'items with prices',
    
    // Shop mode
    ofItems: 'of',
    items: 'items',
    enableLearning: 'Enable learning for this trip',
    learningMessageStart: 'As you check off items, the app learns your shopping patterns. Next time you shop at this location, your list will match your route.',
    learningMessageProgress: 'Checking off items ({checked}/{total})... The app is learning your shopping sequence. Next time you shop at this location, your list will be optimized.',
    learningMessageComplete: "Great job! You've completed your shopping. The app has learned your route at this location for next time.",
    
    // Voice added
    addedViaVoice: 'Added via voice on',
  },
  nl: {
    // Header
    appName: 'L1st.ai',
    download: 'Download',
    launchApp: 'App Starten',
    
    // Navigation
    pickList: 'Kieslijst',
    shoppingList: 'Boodschappenlijst',
    
    // Auth
    login: 'Inloggen',
    logout: 'Uitloggen',
    register: 'Registreren',
    email: 'E-mail',
    password: 'Wachtwoord',
    name: 'Naam',
    continueWith: 'Of ga verder met',
    signInWithGoogle: 'Inloggen met Google',
    signUpWithGoogle: 'Registreren met Google',
    dontHaveAccount: 'Nog geen account?',
    alreadyHaveAccount: 'Heb je al een account?',
    
    // Picklist page
    products: 'producten',
    product: 'product',
    estimatedCost: 'Geschatte kosten',
    credits: 'credits',
    searchProducts: 'Zoek producten...',
    voiceInput: 'Spraakinvoer',
    listening: 'Luisteren...',
    uploadImages: 'Upload Afbeeldingen',
    addProduct: 'Product Toevoegen',
    all: 'Alles',
    
    // Selection stats
    selectionProgress: 'Selectie Voortgang',
    selected: 'Geselecteerd',
    remaining: 'Resterend',
    
    // Empty state
    startBuildingPicklist: 'Begin met je Kieslijst',
    uploadOrAddManually: 'Upload een foto van je koelkast, voorraadkast of kassabon, of voeg producten handmatig toe',
    
    // Product card
    price: 'Prijs',
    nutrition: 'Voeding',
    alternatives: 'Alternatieven',
    notes: 'Notities',
    delete: 'Verwijderen',
    expandDetails: 'Details uitklappen',
    collapseDetails: 'Details inklappen',
    
    // Sources
    receipt: 'Kassabon',
    productImage: 'Productfoto',
    fridge: 'Koelkast',
    dish: 'Gerecht',
    recipe: 'Recept',
    voiceInputSource: 'Spraakinvoer',
    
    // Upload modal
    uploadImagesTitle: 'Upload Afbeeldingen',
    uploadAnyImage: 'Upload een willekeurige boodschappen-gerelateerde afbeelding! Onze AI zal',
    automaticallyDetect: 'automatisch detecteren',
    imageTypeDescription: 'of het een koelkast, kassabon, gerecht, recept of productfoto is en alle items dienovereenkomstig extraheren.',
    dragDropImages: 'Sleep afbeeldingen hierheen of klik om te selecteren',
    supportedFormats: 'Ondersteunde formaten: PNG, JPG, JPEG, WebP',
    images: 'afbeeldingen',
    image: 'afbeelding',
    readyToProcess: 'Klaar om te verwerken',
    analyzingImage: 'Afbeelding analyseren...',
    addedProducts: 'Toegevoegd',
    processingImages: 'Afbeeldingen verwerken...',
    closeWhenDone: 'Sluiten wanneer klaar',
    cancel: 'Annuleren',
    processWithAI: 'Verwerken met AI',
    
    // Add product modal
    addProductManually: 'Product Handmatig Toevoegen',
    productName: 'Productnaam',
    productNamePlaceholder: 'bijv. Volle Melk',
    category: 'Categorie',
    quantity: 'Hoeveelheid',
    unit: 'Eenheid',
    notesOptional: 'Notities',
    notesPlaceholder: 'Optionele notities...',
    
    // Categories
    categories: {
      'Fresh Produce': 'Verse Producten',
      'Meat & Seafood': 'Vlees & Vis',
      'Dairy & Eggs': 'Zuivel & Eieren',
      'Bakery & Bread': 'Bakkerij & Brood',
      'Frozen Foods': 'Diepvriesproducten',
      'Pantry & Dry Goods': 'Voorraadkast & Droge Waren',
      'Canned & Jarred Foods': 'Blik & Potjes',
      'Snacks & Chips': 'Snacks & Chips',
      'Candy & Chocolate': 'Snoep & Chocolade',
      'Beverages': 'Dranken',
      'Wine & Spirits': 'Wijn & Sterke Drank',
      'Breakfast & Cereals': 'Ontbijt & Granen',
      'Deli & Prepared Foods': 'Delicatessen',
      'Condiments & Sauces': 'Kruiderijen & Sauzen',
      'Baking Supplies': 'Bakbenodigdheden',
      'Health & Wellness': 'Gezondheid & Wellness',
      'Baby Products': 'Babyproducten',
      'Pet Supplies': 'Huisdierbenodigdheden',
      'Personal Care & Beauty': 'Persoonlijke Verzorging & Schoonheid',
      'Household & Cleaning': 'Huishouden & Schoonmaak',
      'Kitchen & Dining': 'Keuken & Eetgerei',
      'Home & Garden': 'Huis & Tuin',
    },
    
    // Bottom bar
    itemsInShoppingList: 'items in boodschappenlijst',
    itemInShoppingList: 'item in boodschappenlijst',
    viewShoppingList: 'Bekijk Boodschappenlijst',
    
    // Shopping list page
    myShoppingList: 'Mijn Boodschappenlijst',
    sortBy: 'Sorteer op',
    addedOrder: 'Toevoegvolgorde',
    checkOffOrder: 'Afvink Volgorde',
    alphabetical: 'Alfabetisch',
    backToPicklist: 'Terug naar Kieslijst',
    checkedOff: 'Afgevinkt',
    downloadList: 'Download Lijst',
    clearChecked: 'Wis Afgevinkt',
    startShopping: 'Start Winkelen',
    estimatedTotal: 'Geschat totaal',
    itemsWithPrices: 'items met prijzen',
    
    // Shop mode
    ofItems: 'van',
    items: 'items',
    enableLearning: 'Leren inschakelen voor deze winkeltrip',
    learningMessageStart: 'Terwijl je items afvinkt, leert de app je winkelpatronen. De volgende keer dat je op deze locatie winkelt, zal je lijst overeenkomen met je route.',
    learningMessageProgress: 'Items afvinken ({checked}/{total})... De app leert je winkelsequentie. De volgende keer dat je op deze locatie winkelt, zal je lijst geoptimaliseerd zijn.',
    learningMessageComplete: 'Goed gedaan! Je hebt je boodschappen voltooid. De app heeft je route op deze locatie geleerd voor de volgende keer.',
    
    // Voice added
    addedViaVoice: 'Toegevoegd via spraak op',
  },
}

export function useTranslation() {
  const { language } = useLanguage()
  
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if translation not found
        value = translations['en']
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if not found
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }
  
  return { t, language }
}
