'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { mockOrders, deliveryStatusSteps } from '@/lib/mock-data'
import { Order } from '@/lib/types'
import { MapPin, Clock, Package, CheckCircle } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Simulate loading orders
    setOrders(mockOrders)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'confirmed':
      case 'preparing':
        return <Package className="w-5 h-5" />
      case 'on_the_way':
        return <MapPin className="w-5 h-5" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-orange-600'
      case 'confirmed':
      case 'preparing':
        return 'text-blue-600'
      case 'on_the_way':
        return 'text-primary'
      case 'delivered':
        return 'text-green-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={0} onCartClick={() => {}} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Order More
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-border bg-background">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                      <h3 className="text-xl font-bold text-foreground">{order.id}</h3>
                    </div>
                    <div className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-semibold">{formatStatus(order.status)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Ordered On</p>
                      <p className="font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                    {order.status === 'delivered' && order.actualDelivery && (
                      <div>
                        <p className="text-muted-foreground mb-1">Delivered On</p>
                        <p className="font-medium">{formatDate(order.actualDelivery)}</p>
                      </div>
                    )}
                    {order.status !== 'delivered' && order.estimatedDelivery && (
                      <div>
                        <p className="text-muted-foreground mb-1">Est. Delivery</p>
                        <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6 border-b border-border bg-muted/30">
                  <p className="text-sm font-semibold text-muted-foreground mb-3">Items</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-foreground">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-semibold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Timeline */}
                <div className="p-6 border-b border-border">
                  <p className="text-sm font-semibold text-muted-foreground mb-4">Delivery Progress</p>
                  <div className="space-y-4">
                    {deliveryStatusSteps.map((step, idx) => {
                      const isCompleted = deliveryStatusSteps
                        .slice(0, idx + 1)
                        .every(
                          (s) =>
                            order.status === s.key ||
                            deliveryStatusSteps
                              .map((st) => st.key)
                              .indexOf(order.status) >
                            deliveryStatusSteps.map((st) => st.key).indexOf(s.key)
                        )
                      const isActive = order.status === step.key

                      return (
                        <div key={step.key} className="flex gap-4">
                          {/* Timeline Dot and Line */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                                isCompleted
                                  ? 'bg-green-600 text-white'
                                  : isActive
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            {idx < deliveryStatusSteps.length - 1 && (
                              <div
                                className={`w-0.5 h-12 mt-2 ${
                                  isCompleted || isActive ? 'bg-primary' : 'bg-border'
                                }`}
                              />
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="pt-1 pb-4 flex-1">
                            <p
                              className={`font-semibold ${
                                isCompleted || isActive
                                  ? 'text-foreground'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="p-6 bg-muted/30">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
                      <p className="font-medium text-foreground">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-4 border-t border-border">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-8">
              You haven&apos;t placed any orders yet. Start shopping now!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
