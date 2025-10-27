import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore'
import { db, getUserProductsCollection, getUserTripsCollection, getUserProfilePath } from './firebase'
import type { Product, ShoppingTrip, ProductDetails, SharingConfig, SharedListAccess } from '@/types'

// ========================================
// PRODUCT OPERATIONS
// ========================================

/**
 * Add a new product to user's collection
 */
export async function addProduct(
  userId: string,
  productData: Omit<Product, 'id' | 'inShoppingList' | 'checkedOff'>
): Promise<string> {
  const productsRef = collection(db, getUserProductsCollection(userId))
  const newDocRef = doc(productsRef)
  
  const product = {
    ...productData,
    inShoppingList: false,
    checkedOff: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  await setDoc(newDocRef, product)
  return newDocRef.id
}

/**
 * Update an existing product
 */
export async function updateProduct(
  userId: string,
  productId: string,
  updates: Partial<Product>
): Promise<void> {
  const productRef = doc(db, getUserProductsCollection(userId), productId)
  
  await updateDoc(productRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

/**
 * Delete a product
 */
export async function deleteProduct(
  userId: string,
  productId: string
): Promise<void> {
  const productRef = doc(db, getUserProductsCollection(userId), productId)
  
  // Get product to check for image
  const productSnap = await getDoc(productRef)
  if (productSnap.exists()) {
    const data = productSnap.data()
    // If product has an image in storage, delete it
    if (data.imageStoragePath) {
      try {
        await deleteProductImage(data.imageStoragePath)
      } catch (error) {
        console.error('Error deleting product image:', error)
      }
    }
  }
  
  await deleteDoc(productRef)
}

/**
 * Toggle product in shopping list
 */
export async function toggleProductInList(
  userId: string,
  productId: string
): Promise<void> {
  const productRef = doc(db, getUserProductsCollection(userId), productId)
  const productSnap = await getDoc(productRef)
  
  if (productSnap.exists()) {
    const currentState = productSnap.data().inShoppingList
    await updateDoc(productRef, {
      inShoppingList: !currentState,
      updatedAt: Timestamp.now(),
    })
  }
}

/**
 * Check off a product during shopping
 */
export async function checkOffProduct(
  userId: string,
  productId: string,
  checkOffOrder: number
): Promise<void> {
  const productRef = doc(db, getUserProductsCollection(userId), productId)
  
  await updateDoc(productRef, {
    checkedOff: true,
    checkOffOrder,
    updatedAt: Timestamp.now(),
  })
}

/**
 * Clear all checked products (reset after shopping)
 */
export async function clearCheckedProducts(userId: string): Promise<void> {
  const productsRef = collection(db, getUserProductsCollection(userId))
  const q = query(productsRef, where('checkedOff', '==', true))
  
  const snapshot = await getDocs(q)
  const batch = writeBatch(db)
  
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, {
      checkedOff: false,
      checkOffOrder: null,
      updatedAt: Timestamp.now(),
    })
  })
  
  await batch.commit()
}

/**
 * Reorder products (batch update)
 */
export async function reorderProducts(
  userId: string,
  products: Product[]
): Promise<void> {
  const batch = writeBatch(db)
  
  products.forEach((product, index) => {
    const productRef = doc(db, getUserProductsCollection(userId), product.id)
    batch.update(productRef, {
      order: index,
      updatedAt: Timestamp.now(),
    })
  })
  
  await batch.commit()
}

/**
 * Delete all products for a user
 */
export async function clearAllProducts(userId: string): Promise<void> {
  const productsRef = collection(db, getUserProductsCollection(userId))
  const snapshot = await getDocs(productsRef)
  
  const batch = writeBatch(db)
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })
  
  await batch.commit()
}

/**
 * Subscribe to real-time product updates
 */
export function subscribeToProducts(
  userId: string,
  callback: (products: Product[]) => void
): Unsubscribe {
  const productsRef = collection(db, getUserProductsCollection(userId))
  const q = query(productsRef, orderBy('createdAt', 'desc'))
  
  return onSnapshot(q, (snapshot) => {
    const products: Product[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
    
    callback(products)
  })
}

// ========================================
// SHOPPING TRIP OPERATIONS
// ========================================

/**
 * Add a completed shopping trip
 */
export async function addShoppingTrip(
  userId: string,
  trip: Omit<ShoppingTrip, 'id'>
): Promise<string> {
  const tripsRef = collection(db, getUserTripsCollection(userId))
  const newDocRef = doc(tripsRef)
  
  const tripData = {
    ...trip,
    completedAt: Timestamp.now(),
  }
  
  await setDoc(newDocRef, tripData)
  return newDocRef.id
}

/**
 * Subscribe to real-time shopping trip updates
 */
export function subscribeToShoppingTrips(
  userId: string,
  callback: (trips: ShoppingTrip[]) => void
): Unsubscribe {
  const tripsRef = collection(db, getUserTripsCollection(userId))
  const q = query(tripsRef, orderBy('completedAt', 'desc'))
  
  return onSnapshot(q, (snapshot) => {
    const trips: ShoppingTrip[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ShoppingTrip[]
    
    callback(trips)
  })
}

// ========================================
// IMAGE/STORAGE OPERATIONS
// ========================================
// NOTE: Firebase Storage is disabled for now.
// Images will use external URLs or data URLs only.

/**
 * Upload product image to Firebase Storage
 * DISABLED: Storage not configured yet
 */
export async function uploadProductImage(
  userId: string,
  file: File,
  productId?: string
): Promise<{ url: string; path: string }> {
  console.warn('Firebase Storage not configured. Using local data URL instead.')
  
  // Convert to data URL as fallback
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve({
        url: reader.result as string,
        path: '', // No storage path
      })
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Delete product image from Firebase Storage
 * DISABLED: Storage not configured yet
 */
export async function deleteProductImage(storagePath: string): Promise<void> {
  console.warn('Firebase Storage not configured. Skipping image deletion.')
  // No-op when storage is disabled
  return Promise.resolve()
}

// ========================================
// CREDITS OPERATIONS
// ========================================

/**
 * Get user's credit balance
 */
export async function getUserCredits(userId: string): Promise<number> {
  const profileRef = doc(db, 'users', userId, 'profile', 'data')
  const profileSnap = await getDoc(profileRef)
  
  if (profileSnap.exists()) {
    return profileSnap.data().credits || 0
  }
  
  // Initialize with default credits if profile doesn't exist
  await setDoc(profileRef, { credits: 100 })
  return 100
}

/**
 * Update user's credits
 */
export async function updateCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const profileRef = doc(db, 'users', userId, 'profile', 'data')
  const profileSnap = await getDoc(profileRef)
  
  let currentCredits = 100
  if (profileSnap.exists()) {
    currentCredits = profileSnap.data().credits || 0
  }
  
  const newCredits = currentCredits + amount
  
  if (newCredits < 0) {
    return false // Not enough credits
  }
  
  await setDoc(profileRef, { credits: newCredits }, { merge: true })
  return true
}

/**
 * Use credits (subtract)
 */
export async function useCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  return await updateCredits(userId, -amount)
}

/**
 * Subscribe to real-time credits updates
 */
export function subscribeToCredits(
  userId: string,
  callback: (credits: number) => void
): Unsubscribe {
  const profileRef = doc(db, 'users', userId, 'profile', 'data')
  
  return onSnapshot(profileRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data().credits || 0)
    } else {
      callback(100) // Default
    }
  })
}

// ========================================
// SHARING OPERATIONS
// ========================================

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<{ id: string; name: string; email: string } | null> {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('email', '==', email))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    return null
  }
  
  const userDoc = snapshot.docs[0]
  const userData = userDoc.data()
  
  return {
    id: userDoc.id,
    name: userData.name || userData.displayName || 'Unknown',
    email: userData.email,
  }
}

/**
 * Get user info by ID
 */
export async function getUserById(userId: string): Promise<{ id: string; name: string; email: string } | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    
    if (!userDoc.exists()) {
      return null
    }
    
    const userData = userDoc.data()
    return {
      id: userDoc.id,
      name: userData.name || userData.displayName || 'User',
      email: userData.email || '',
    }
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

/**
 * Grant immediate access to a collaborator (no acceptance needed)
 */
export async function grantAccess(
  userId: string,
  userName: string,
  userEmail: string,
  collaboratorId: string,
  collaboratorName: string,
  collaboratorEmail: string
): Promise<void> {
  const batch = writeBatch(db)
  
  // Create sharing config for the owner
  const sharingRef = doc(db, 'users', userId, 'sharing', 'config')
  batch.set(sharingRef, {
    collaboratorId,
    collaboratorEmail,
    collaboratorName,
    invitedAt: Timestamp.now(),
    acceptedAt: Timestamp.now(),
    status: 'accepted',
  })
  
  // Create access record for the collaborator
  const accessRef = doc(db, 'sharedAccess', collaboratorId, 'lists', userId)
  batch.set(accessRef, {
    ownerId: userId,
    ownerEmail: userEmail,
    ownerName: userName,
    accessGrantedAt: Timestamp.now(),
    lastActivity: Timestamp.now(),
    status: 'accepted',
  })
  
  await batch.commit()
}

/**
 * Invite a collaborator to share your list (deprecated - use grantAccess instead)
 */
export async function inviteCollaborator(
  userId: string,
  userName: string,
  userEmail: string,
  collaboratorId: string,
  collaboratorName: string,
  collaboratorEmail: string
): Promise<void> {
  // Now just calls grantAccess for immediate access
  return grantAccess(userId, userName, userEmail, collaboratorId, collaboratorName, collaboratorEmail)
}

/**
 * Accept a shared list invitation
 */
export async function acceptSharedList(
  collaboratorId: string,
  ownerId: string
): Promise<void> {
  const batch = writeBatch(db)
  
  // Update owner's sharing config
  const sharingRef = doc(db, 'users', ownerId, 'sharing', 'config')
  batch.update(sharingRef, {
    acceptedAt: Timestamp.now(),
    status: 'accepted',
  })
  
  // Update collaborator's access record
  const accessRef = doc(db, 'sharedAccess', collaboratorId, 'lists', ownerId)
  batch.update(accessRef, {
    status: 'accepted',
    lastActivity: Timestamp.now(),
  })
  
  await batch.commit()
}

/**
 * Decline a shared list invitation
 */
export async function declineSharedList(
  collaboratorId: string,
  ownerId: string
): Promise<void> {
  const batch = writeBatch(db)
  
  // Delete owner's sharing config
  const sharingRef = doc(db, 'users', ownerId, 'sharing', 'config')
  batch.delete(sharingRef)
  
  // Delete collaborator's access record
  const accessRef = doc(db, 'sharedAccess', collaboratorId, 'lists', ownerId)
  batch.delete(accessRef)
  
  await batch.commit()
}

/**
 * Remove collaborator (called by owner)
 */
export async function removeCollaborator(
  userId: string,
  collaboratorId: string
): Promise<void> {
  const batch = writeBatch(db)
  
  // Delete owner's sharing config
  const sharingRef = doc(db, 'users', userId, 'sharing', 'config')
  batch.delete(sharingRef)
  
  // Delete collaborator's access record
  const accessRef = doc(db, 'sharedAccess', collaboratorId, 'lists', userId)
  batch.delete(accessRef)
  
  await batch.commit()
}

/**
 * Get sharing configuration for a user
 */
export async function getSharingConfig(userId: string): Promise<SharingConfig | null> {
  const sharingRef = doc(db, 'users', userId, 'sharing', 'config')
  const snapshot = await getDoc(sharingRef)
  
  if (snapshot.exists()) {
    return snapshot.data() as SharingConfig
  }
  
  return null
}

/**
 * Get lists shared WITH this user
 */
export async function getSharedListsAccess(userId: string): Promise<SharedListAccess[]> {
  const accessRef = collection(db, 'sharedAccess', userId, 'lists')
  const snapshot = await getDocs(accessRef)
  
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
  })) as SharedListAccess[]
}

/**
 * Subscribe to sharing config updates
 */
export function subscribeToSharingConfig(
  userId: string,
  callback: (config: SharingConfig | null) => void
): Unsubscribe {
  const sharingRef = doc(db, 'users', userId, 'sharing', 'config')
  
  return onSnapshot(sharingRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as SharingConfig)
    } else {
      callback(null)
    }
  })
}

/**
 * Subscribe to shared lists access updates (lists shared WITH me)
 */
export function subscribeToSharedAccess(
  userId: string,
  callback: (lists: SharedListAccess[]) => void
): Unsubscribe {
  const accessRef = collection(db, 'sharedAccess', userId, 'lists')
  
  return onSnapshot(accessRef, (snapshot) => {
    const lists = snapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as SharedListAccess[]
    callback(lists)
  })
}
