'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { mockOrders } from '@/lib/mock-data'
import { Package, Clock, MapPin, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context'

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useApp()
  const [selectedOrder, setSelectedOrder] = useState(mockOrders[0]?.id)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const order = mockOrders.find((o) => o.id === selectedOrder)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700'
      case 'confirmed':
        return 'bg-blue-50 text-blue-700'
      case 'preparing':
        return 'bg-purple-50 text-purple-700'
      case 'ready_for_pickup':
        return 'bg-purple-50 text-purple-700'
      case 'out_for_delivery':
        return 'bg-orange-50 text-orange-700'
      case 'delivered':
        return 'bg-green-50 text-green-700'
      case 'cancelled':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your grocery orders</p>
        </div>

        {mockOrders.length === 0 ? (
          <div className="text-center py-12 border border-border rounded-lg">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
            <Link href="/app" className="text-primary font-semibold hover:underline">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-1 space-y-3 max-h-96 overflow-y-auto">
              {mockOrders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrder(o.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedOrder === o.id
                      ? 'bg-primary/10 border-primary'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold">{o.id}</p>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(o.status)}`}>
                      {getStatusLabel(o.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-semibold text-sm">${o.totalAmount.toFixed(2)}</p>
                </button>
              ))}
            </div>

            {/* Order Details */}
            {order && (
              <div className="lg:col-span-2 space-y-6">
                {/* Status Card */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider">Order ID</p>
                      <h2 className="text-2xl font-bold font-mono">{order.id}</h2>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Ordered</p>
                      <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Est. Delivery</p>
                      <p className="text-sm font-semibold">{order.estimatedDelivery} mins</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">Total</p>
                      <p className="text-sm font-semibold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Timeline */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                  <h3 className="font-semibold text-lg">Delivery Timeline</h3>

                  <div className="space-y-4">
                    {order.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 ${idx <= order.timeline.length - 1 ? 'bg-primary border-primary' : 'bg-muted border-muted'}`} />
                          {idx < order.timeline.length - 1 && (
                            <div className={`w-0.5 h-12 ${idx < order.timeline.length - 1 ? 'bg-primary' : 'bg-muted'}`} />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-semibold text-sm">{getStatusLabel(event.status)}</p>
                          <p className="text-xs text-muted-foreground">{event.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Items</h3>

                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center pb-3 border-b border-border last:border-0">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Delivery Address</h3>
                    </div>
                    <p className="text-sm">{order.deliveryAddress.street}</p>
                    <p className="text-sm">
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                )}

                {/* Delivery Agent */}
                {order.deliveryAgent && (
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold">Delivery Agent</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                          {order.deliveryAgent.avatar}
                        </div>
                        <div>
                          <p className="font-semibold">{order.deliveryAgent.name}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 fill-accent text-accent" />
                            <span>{order.deliveryAgent.rating}</span>
                          </div>
                        </div>
                      </div>
                      <a href={`tel:${order.deliveryAgent.phone}`} className="px-4 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-secondary transition-colors">
                        Call
                      </a>
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold mb-4">Price Summary</h3>
                  <div className="space-y-2 text-sm border-b border-border pb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${(order.totalAmount - order.discountAmount - order.deliveryFee - order.tax).toFixed(2)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-accent">
                        <span className="text-muted-foreground">Discount</span>
                        <span>-${order.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="font-semibold">Total Paid</span>
                    <span className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Review Section */}
                {order.status === 'delivered' && !order.rating && (
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold">Rate this order</h3>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} className="text-3xl hover:scale-110 transition-transform">
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Share your feedback..."
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-24"
                    />
                    <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
                      Submit Review
                    </button>
                  </div>
                )}

                {order.rating && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < order.rating! ? 'text-2xl text-accent' : 'text-2xl text-muted'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {order.review && <p className="text-sm text-muted-foreground">{order.review}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
