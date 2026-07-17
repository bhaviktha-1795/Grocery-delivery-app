'use client'

import { AppLayout } from '@/components/app-layout'
import { mockStores, mockProducts } from '@/lib/mock-data'
import { useRouter } from 'next/navigation'
import { ChevronLeft, MapPin, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import { useState, use } from 'react'

export default function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const store = mockStores.find((s) => s.id === id)
  const [selectedCategory, setSelectedCategory] = useState('all')

  if (!store) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Store not found</p>
        </div>
      </AppLayout>
    )
  }

  const filteredProducts =
    selectedCategory === 'all'
      ? mockProducts
      : mockProducts.filter((p) => p.categoryId === selectedCategory)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Store Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{store.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                {store.address}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-lg font-bold mb-2">
                <Star className="w-5 h-5 fill-accent text-accent" />
                {store.rating}
              </div>
              <p className="text-sm text-muted-foreground">{store.reviewCount} reviews</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{store.deliveryTime}</p>
              <p className="text-xs text-muted-foreground">min delivery</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">${store.deliveryFee}</p>
              <p className="text-xs text-muted-foreground">delivery fee</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{store.distance} km</p>
              <p className="text-xs text-muted-foreground">away</p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Shop by Category</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              All
            </button>
            {[
              { id: 'fruits', name: '🍎 Fruits', icon: '🍎' },
              { id: 'vegetables', name: '🥬 Vegetables', icon: '🥬' },
              { id: 'dairy', name: '🧀 Dairy', icon: '🧀' },
              { id: 'bakery', name: '🍞 Bakery', icon: '🍞' },
              { id: 'beverages', name: '🥤 Beverages', icon: '🥤' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
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
                  </div>

                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <p className="text-lg font-bold">${product.price}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          ${product.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
