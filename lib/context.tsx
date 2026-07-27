'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { User, CartItem, Product, Coupon } from './types'
import { mockStores } from './mock-data'

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
  appliedCoupon: Coupon | null
  couponDiscount: number
  couponError: string
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('grocergo_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')

  // Initialize user and coupon from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('grocergo_user')
        if (saved) {
          const userData = JSON.parse(saved)
          setUser(userData)
        }
        const savedCoupon = localStorage.getItem('grocergo_coupon')
        if (savedCoupon) {
          const couponData = JSON.parse(savedCoupon)
          setAppliedCoupon(couponData)
        }
      } catch {
        console.error('Failed to load from localStorage')
      }
      setIsHydrated(true)
    }
  }, [])

  // Persist user to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      if (user) {
        localStorage.setItem('grocergo_user', JSON.stringify(user))
      } else {
        localStorage.removeItem('grocergo_user')
      }
    }
  }, [user, isHydrated])

  // Persist cart to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('grocergo_cart', JSON.stringify(cart))
    }
  }, [cart])

  // Persist coupon to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      if (appliedCoupon) {
        localStorage.setItem('grocergo_coupon', JSON.stringify(appliedCoupon))
      } else {
        localStorage.removeItem('grocergo_coupon')
      }
    }
  }, [appliedCoupon, isHydrated])

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

  const applyCoupon = (code: string): boolean => {
    setCouponError('')
    
    // Find coupon from all stores
    let foundCoupon: Coupon | null = null
    for (const store of mockStores) {
      const coupon = store.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase())
      if (coupon) {
        foundCoupon = coupon
        break
      }
    }

    if (!foundCoupon) {
      setCouponError('Invalid coupon code')
      return false
    }

    // Check if coupon is active
    if (!foundCoupon.isActive) {
      setCouponError('This coupon is not active')
      return false
    }

    // Check if coupon has expired
    if (new Date() > new Date(foundCoupon.expiryDate)) {
      setCouponError('This coupon has expired')
      return false
    }

    // Check if max uses reached
    if (foundCoupon.usedCount >= foundCoupon.maxUses) {
      setCouponError('This coupon has reached maximum uses')
      return false
    }

    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

    // Check minimum order requirement
    if (subtotal < foundCoupon.minOrder) {
      setCouponError(`Minimum order amount is $${foundCoupon.minOrder}`)
      return false
    }

    // Calculate discount
    let discount = 0
    if (foundCoupon.discountType === 'percentage') {
      discount = (subtotal * foundCoupon.discount) / 100
    } else {
      discount = foundCoupon.discount
    }

    setAppliedCoupon(foundCoupon)
    setCouponDiscount(discount)
    return true
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
    setCouponError('')
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
        appliedCoupon,
        couponDiscount,
        couponError,
        applyCoupon,
        removeCoupon,
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
