'use client'

import { useStore } from '@/store'
import { ChevronDown, List, Users } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function ListSwitcher() {
  const { activeListOwnerId, sharedListsAccess, user, switchToList, getActiveListOwner } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeOwner = getActiveListOwner()
  const isMyList = !activeListOwnerId

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Only show if there are shared lists
  if (sharedListsAccess.length === 0) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {isMyList ? (
          <>
            <List className="w-4 h-4 text-gray-600" />
            <span className="text-body font-medium text-gray-900">My List</span>
          </>
        ) : (
          <>
            <Users className="w-4 h-4 text-primary-purple" />
            <span className="text-body font-medium text-gray-900">
              {activeOwner?.name}'s List
            </span>
          </>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-card-hover z-50">
          {/* My List */}
          <button
            onClick={() => {
              switchToList(null)
              setIsOpen(false)
            }}
            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg ${
              isMyList ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <List className={`w-5 h-5 ${isMyList ? 'text-primary-purple' : 'text-gray-600'}`} />
              <div className="flex-1">
                <p className={`text-body font-medium ${isMyList ? 'text-gray-900' : 'text-gray-700'}`}>
                  My List
                </p>
                <p className="text-body-xs text-gray-500">{user?.email}</p>
              </div>
              {isMyList && (
                <div className="w-2 h-2 rounded-full bg-primary-purple" />
              )}
            </div>
          </button>

          {/* Shared Lists */}
          {sharedListsAccess.map((sharedList) => {
            const isActive = activeListOwnerId === sharedList.ownerId
            
            return (
              <button
                key={sharedList.ownerId}
                onClick={() => {
                  switchToList(sharedList.ownerId)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-t border-gray-100 last:rounded-b-lg ${
                  isActive ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-5 h-5 ${isActive ? 'text-primary-purple' : 'text-gray-600'}`} />
                  <div className="flex-1">
                    <p className={`text-body font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                      {sharedList.ownerName}'s List
                    </p>
                    <p className="text-body-xs text-gray-500">{sharedList.ownerEmail}</p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-primary-purple" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
