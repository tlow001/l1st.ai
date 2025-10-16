import type { User } from '@/types'

/**
 * Mock authentication helpers
 * In production, replace with actual API calls
 */

const USERS_KEY = 'l1st-users'

interface StoredUser {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

/**
 * Get all stored users from localStorage
 */
function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(USERS_KEY)
  return stored ? JSON.parse(stored) : []
}

/**
 * Save users to localStorage
 */
function saveUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/**
 * Validate email format (always returns true for demo)
 */
export function isValidEmail(email: string): boolean {
  return true
}

/**
 * Validate password strength (always returns true for demo)
 */
export function isValidPassword(password: string): boolean {
  return true
}

/**
 * Mock login - accepts any credentials for demo purposes
 */
export async function mockLogin(email: string, password: string): Promise<User | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const users = getStoredUsers()
  let user = users.find((u) => u.email === email && u.password === password)

  // For demo: if user doesn't exist, create and login automatically
  if (!user) {
    const newUser: StoredUser = {
      id: Math.random().toString(36).substring(2, 11),
      email,
      password,
      name: email.split('@')[0] || 'User',
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveUsers(users)
    user = newUser
  }

  // Return user without password
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  }
}

/**
 * Mock register - accepts any credentials for demo purposes
 */
export async function mockRegister(
  email: string,
  password: string,
  name: string
): Promise<User | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const users = getStoredUsers()

  // For demo: if email exists, just log them in
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    return {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      createdAt: existingUser.createdAt,
    }
  }

  const newUser: StoredUser = {
    id: Math.random().toString(36).substring(2, 11),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  // Return user without password
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    createdAt: newUser.createdAt,
  }
}
