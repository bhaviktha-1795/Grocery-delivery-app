'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { mockStores } from '@/lib/mock-data'
import { MapPin, Star, Clock, DollarSign, Phone, Navigation, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context'

export default function StoresPage() {
  const router = useRouter()
  const { isAuthenticated } = useApp()
  const [selectedStore, setSelectedStore] = useState<string | null>(mockStores[0].id)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'delivery'>('distance')

  const sortedStores = [...mockStores].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distance - b.distance
      case 'rating':
        return b.rating - a.rating
      case 'delivery':
        return a.deliveryTime - b.deliveryTime
      default:
        return 0
    }
  })

  const selectedStoreData = mockStores.find((s) => s.id === selectedStore)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Find Nearby Stores</h1>
          <p className="text-muted-foreground">Browse and select from our partner stores</p>
        </div>

        {/* Map Section */}
        <div className="bg-card border border-border rounded-lg overflow-hidden h-96 relative flex items-center justify-center bg-muted">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">Interactive map view</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              In production, this would display an interactive map with store locations, delivery zones, and real-time tracking
            </p>
            <div className="pt-2">
              {selectedStoreData && (
                <div className="inline-block bg-background/80 backdrop-blur border border-border rounded-lg p-3">
                  <p className="font-semibold text-sm">{selectedStoreData.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedStoreData.address}</p>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      {selectedStoreData.distance} km
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Sort Options */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm">Sort by</h3>
              <div className="space-y-2">
                {(['distance', 'rating', 'delivery'] as const).map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value={option}
                      checked={sortBy === option}
                      onChange={(e) => setSortBy(e.target.value as typeof option)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stores List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sortedStores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setSelectedStore(store.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedStore === store.id
                      ? 'bg-primary/10 border-primary'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm line-clamp-1">{store.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-xs font-semibold">{store.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{store.address}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Navigation className="w-3 h-3" />
                    {store.distance} km
                    <Clock className="w-3 h-3 ml-1" />
                    {store.deliveryTime}m
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Store Details */}
          {selectedStoreData && (
            <div className="lg:col-span-2 space-y-4">
              {/* Store Header */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{selectedStoreData.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedStoreData.address}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Available
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold">
                      <Star className="w-5 h-5 fill-accent text-accent" />
                      {selectedStoreData.rating}
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedStoreData.reviewCount} reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold">
                      <Clock className="w-5 h-5 text-primary" />
                      {selectedStoreData.deliveryTime}
                    </div>
                    <p className="text-xs text-muted-foreground">minutes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold">
                      <Navigation className="w-5 h-5 text-accent" />
                      {selectedStoreData.distance}
                    </div>
                    <p className="text-xs text-muted-foreground">km away</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-lg font-bold">
                      <DollarSign className="w-5 h-5 text-primary" />
                      {selectedStoreData.deliveryFee}
                    </div>
                    <p className="text-xs text-muted-foreground">delivery</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Link
                    href={`/app/store/${selectedStoreData.id}`}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
                  >
                    Browse Products
                  </Link>
                  <button className="px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors">
                    Share
                  </button>
                </div>
              </div>

              {/* Coupons & Offers */}
              {(selectedStoreData.coupons.length > 0 || selectedStoreData.specialOffers.length > 0) && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold">Available Offers</h3>

                  {/* Coupons */}
                  {selectedStoreData.coupons.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Coupons</p>
                      {selectedStoreData.coupons.map((coupon) => (
                        <div
                          key={coupon.id}
                          className="p-3 border border-accent/30 bg-accent/5 rounded-lg flex items-start justify-between"
                        >
                          <div>
                            <p className="font-semibold text-sm">{coupon.code}</p>
                            <p className="text-xs text-muted-foreground">{coupon.description}</p>
                          </div>
                          <button className="px-3 py-1 bg-accent text-accent-foreground rounded text-xs font-semibold hover:opacity-90">
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Special Offers */}
                  {selectedStoreData.specialOffers.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Special Offers</p>
                      {selectedStoreData.specialOffers.map((offer) => (
                        <div key={offer.id} className="p-3 border border-primary/30 bg-primary/5 rounded-lg">
                          <p className="font-semibold text-sm">{offer.title}</p>
                          <p className="text-xs text-muted-foreground">{offer.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Store Status */}
              <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">
                  {selectedStoreData.isOpen ? 'Store is currently open' : 'Store is currently closed'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
