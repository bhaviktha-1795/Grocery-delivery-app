'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { User, CartItem, Product } from './types'

interface AppContextType {
  user: User | null
  isAuthenticated: boolean
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartItem: (productId: string, quantity: number) => void
  clearCart: () => void
  setUser: (user: User | null) => void
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('grocergo_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist cart to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[v0] Saving cart to localStorage:', cart)
      localStorage.setItem('grocergo_cart', JSON.stringify(cart))
    }
  }, [cart])

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prevCart, { productId: product.id, product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId))
  }

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.productId === productId ? { ...item, quantity } : item))
      )
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const logout = () => {
    setUser(null)
    clearCart()
  }

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        setUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
