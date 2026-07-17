'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'
import { useApp } from '@/lib/context'
import { MapPin, CreditCard, Smartphone, Banknote, Package, Clock, DollarSign, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type Step = 'delivery' | 'payment' | 'confirmation'
type PaymentMethod = 'card' | 'upi' | 'cod' | 'wallet'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, cart, clearCart } = useApp()
  const [currentStep, setCurrentStep] = useState<Step>('delivery')
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses[0]?.id || '')
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState('')

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const deliveryFee = 2.99
  const total = subtotal + tax + deliveryFee

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const newOrderId = `ORD-${Date.now()}`
    setOrderId(newOrderId)
    clearCart()
    setCurrentStep('confirmation')
    setIsProcessing(false)
  }

  if (!user) return null

  if (currentStep === 'confirmation') {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Order Confirmed!</h1>
              <p className="text-muted-foreground">Thank you for your order</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="text-left space-y-2">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="text-2xl font-bold font-mono">{orderId}</p>
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Estimated Delivery</p>
                    <p className="text-sm text-muted-foreground">22-28 minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Items</p>
                    <p className="text-sm text-muted-foreground">{cart.length} items</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">Total Amount</p>
                    <p className="text-sm text-muted-foreground">${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/app/orders"
                className="block w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Track Order
              </Link>
              <Link
                href="/app"
                className="block w-full py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4">
          {(['delivery', 'payment', 'confirmation'] as const).map((step, idx, arr) => (
            <div key={step} className="flex items-center gap-4 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  ['delivery', 'payment', 'confirmation'].indexOf(currentStep) >= idx
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-sm font-medium capitalize hidden sm:inline">{step}</span>
              {idx < arr.length - 1 && (
                <div
                  className={`flex-1 h-1 rounded ${
                    ['delivery', 'payment', 'confirmation'].indexOf(currentStep) > idx
                      ? 'bg-primary'
                      : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            {currentStep === 'delivery' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h2>

                {user.addresses.map((addr) => (
                  <label key={addr.id} className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{addr.label}</p>
                      <p className="text-sm text-muted-foreground">{addr.street}</p>
                      <p className="text-sm text-muted-foreground">
                        {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                    </div>
                    {addr.isDefault && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-semibold">
                        Default
                      </span>
                    )}
                  </label>
                ))}

                <button
                  onClick={() => setCurrentStep('payment')}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment Method */}
            {currentStep === 'payment' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>

                {/* Card */}
                <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={selectedPayment === 'card'}
                    onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, Amex</p>
                  </div>
                </label>

                {/* UPI */}
                <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={selectedPayment === 'upi'}
                    onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <Smartphone className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">UPI</p>
                    <p className="text-sm text-muted-foreground">Google Pay, PhonePe, BHIM</p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={selectedPayment === 'cod'}
                    onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <Banknote className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when delivery arrives</p>
                  </div>
                </label>

                {/* Wallet */}
                <label className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-card/50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={selectedPayment === 'wallet'}
                    onChange={(e) => setSelectedPayment(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <Banknote className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-semibold">GrocerGo Wallet</p>
                    <p className="text-sm text-muted-foreground">Balance: $0.00</p>
                  </div>
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep('delivery')}
                    className="flex-1 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 h-fit sticky top-20">
            <h3 className="font-semibold text-lg">Order Summary</h3>

            <div className="space-y-3 max-h-48 overflow-y-auto border-b border-border pb-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
