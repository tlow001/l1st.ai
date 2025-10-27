import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import type { User } from '@/types'

/**
 * Create or update user document in Firestore
 */
async function ensureUserDocument(firebaseUser: FirebaseUser): Promise<void> {
  const userRef = doc(db, 'users', firebaseUser.uid)
  const userDoc = await getDoc(userRef)
  
  if (!userDoc.exists()) {
    // Create user document if it doesn't exist
    await setDoc(userRef, {
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      displayName: firebaseUser.displayName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

/**
 * Convert Firebase User to App User type
 */
export function firebaseUserToAppUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
  }
}

/**
 * Sign in with Google using popup
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    
    // Ensure user document exists in Firestore
    await ensureUserDocument(result.user)
    
    return firebaseUserToAppUser(result.user)
  } catch (error: any) {
    console.error('Error signing in with Google:', error)
    throw new Error(error.message || 'Failed to sign in with Google')
  }
}

/**
 * Register with email and password
 */
export async function registerWithEmail(
  email: string,
  password: string,
  name: string
): Promise<User | null> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update user profile with name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      })
      
      // Create user document in Firestore
      await ensureUserDocument(userCredential.user)
    }
    
    return firebaseUserToAppUser(userCredential.user)
  } catch (error: any) {
    console.error('Error registering with email:', error)
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already registered')
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters')
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address')
    }
    
    throw new Error(error.message || 'Failed to register')
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Ensure user document exists in Firestore (in case of old users)
    await ensureUserDocument(userCredential.user)
    
    return firebaseUserToAppUser(userCredential.user)
  } catch (error: any) {
    console.error('Error signing in with email:', error)
    
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password')
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address')
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('This account has been disabled')
    }
    
    throw new Error(error.message || 'Failed to sign in')
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    console.error('Error signing out:', error)
    throw new Error(error.message || 'Failed to sign out')
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(firebaseUserToAppUser(firebaseUser))
    } else {
      callback(null)
    }
  })
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  const firebaseUser = auth.currentUser
  return firebaseUser ? firebaseUserToAppUser(firebaseUser) : null
}
