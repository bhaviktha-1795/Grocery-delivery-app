'use client'

import { AppLayout } from '@/components/app-layout'
import { useApp } from '@/lib/context'
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const { cart, removeFromCart, updateCartItem } = useApp()

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discount = cart.reduce((sum, item) => {
    const discount = item.product.originalPrice ? item.product.originalPrice - item.product.price : 0
    return sum + discount * item.quantity
  }, 0)
  const tax = subtotal * 0.08
  const deliveryFee = 2.99
  const total = subtotal + tax + deliveryFee

  if (cart.length === 0) {
    return (
      <AppLayout>
        <div className="min-h-96 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground text-center">Add items from stores to get started</p>
          <Link href="/app" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
            Start Shopping
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">{cart.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="border border-border rounded-lg p-4 flex gap-4 hover:bg-card/50 transition-colors"
              >
                {/* Product Image */}
                <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>

                {/* Product Details */}
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                    <h3 className="font-semibold line-clamp-1">{item.product.name}</h3>
                  </div>

                  <div className="flex items-end justify-between pt-2">
                    <div>
                      <p className="text-lg font-bold">${item.product.price}</p>
                      {item.product.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          ${item.product.originalPrice}
                        </p>
                      )}
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartItem(item.productId, Math.max(1, item.quantity - 1))}
                        className="p-1 border border-border rounded hover:bg-secondary"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                        className="p-1 border border-border rounded hover:bg-secondary"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-destructive hover:bg-destructive/10 rounded p-2 self-start"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4 sticky top-20">
              <h2 className="text-xl font-bold">Order Summary</h2>

              {/* Breakdown */}
              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-accent">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>

              {/* Promo Code */}
              <div className="space-y-2 pt-4 border-t border-border">
                <input
                  type="text"
                  placeholder="Apply coupon code"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button className="w-full py-2 border border-border rounded-lg text-sm font-semibold hover:bg-secondary transition-colors">
                  Apply Coupon
                </button>
              </div>

              {/* Checkout Button */}
              <Link
                href="/app/checkout"
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-center block"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/app"
                className="w-full py-2 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
