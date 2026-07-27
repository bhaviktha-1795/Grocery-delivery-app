'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/app-layout'
import { useApp } from '@/lib/context'
import { mockStores, mockProducts, categories } from '@/lib/mock-data'
import { MapPin, Star, Clock, Tag, TrendingUp, Percent, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AppHome() {
  const router = useRouter()
  const { user, isAuthenticated, applyCoupon } = useApp()
  const [selectedCategory, setSelectedCategory] = useState('fruits')
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [showCouponSuccess, setShowCouponSuccess] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(mockProducts)
    } else {
      const products = mockProducts.filter((p) => p.categoryId === selectedCategory)
      setFilteredProducts(products)
    }
  }, [selectedCategory])

  return (
    <AppLayout>
      {/* Location & Promos */}
      <div className="space-y-6 mb-8">
        {/* Delivery Location */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Delivering to:</span>
          <span className="font-semibold">{user?.addresses[0]?.city || 'New York'}</span>
        </div>

        {/* Promotional Banner - Special Offers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Special Offers</h2>
            <Link href="/app/coupons" className="text-sm font-semibold text-primary hover:underline">
              View all →
            </Link>
          </div>

          {showCouponSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 font-medium">{showCouponSuccess}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockStores[0]?.coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {coupon.discountType === 'percentage' ? (
                        <Percent className="w-5 h-5 text-accent" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-accent" />
                      )}
                      <h3 className="font-bold text-lg">
                        {coupon.discountType === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`} Off
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{coupon.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Code: <span className="font-mono font-bold text-foreground">{coupon.code}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Min order: ${coupon.minOrder}</p>
                  </div>
                  <button
                    onClick={() => {
                      const success = applyCoupon(coupon.code)
                      if (success) {
                        setShowCouponSuccess(`Coupon ${coupon.code} applied! Use it at checkout.`)
                        setTimeout(() => setShowCouponSuccess(''), 4000)
                      }
                    }}
                    className="whitespace-nowrap px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Stores */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Nearby Stores</h2>
          <Link href="/app/stores" className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockStores.map((store) => (
            <div key={store.id} className="border border-border rounded-lg p-4 hover:bg-card/50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{store.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{store.address}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-semibold text-sm">{store.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">({store.reviewCount})</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {store.deliveryTime}m
                </div>
                <div>${store.deliveryFee}</div>
              </div>

              <Link
                href={`/app/store/${store.id}`}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Browse
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-3 rounded-lg border transition-colors text-center ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:border-primary'
            }`}
          >
            <span className="text-2xl block mb-1">🎯</span>
            <span className="text-xs font-medium">All</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-lg border transition-colors text-center ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary'
              }`}
            >
              <span className="text-2xl block mb-1">{cat.icon}</span>
              <span className="text-xs font-medium line-clamp-1">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-bold">Popular Products</h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/app/product/${product.id}`}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>

                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    <span className="text-xs font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                  </div>

                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <p className="text-lg font-bold">${product.price}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">${product.originalPrice}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  )
}
