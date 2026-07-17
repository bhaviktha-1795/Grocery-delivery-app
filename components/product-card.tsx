'use client'

import Image from 'next/image'
import { Product } from '@/lib/types'
import { Star, Plus, Minus } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string, quantity: number) => void
  currentQuantity?: number
}

export function ProductCard({
  product,
  onAddToCart,
  currentQuantity = 0,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(currentQuantity)
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToCart(product.id, quantity)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded-md text-sm font-bold">
            -{discountPercent}%
          </div>
        )}
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold">
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-card-foreground line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-accent text-accent"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            per {product.unit}
          </span>
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between mb-4 text-xs">
          <span className={product.stock > 5 ? 'text-green-600' : 'text-orange-600'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Add to Cart */}
        {product.stock > 0 ? (
          <div className="space-y-2">
            {quantity > 0 && (
              <div className="flex items-center justify-center gap-2 bg-secondary p-2 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="p-1 hover:bg-background rounded transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-1 hover:bg-background rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              onClick={() => {
                if (quantity === 0) {
                  setQuantity(1)
                } else {
                  handleAddToCart()
                  setQuantity(0)
                }
              }}
              className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              {quantity > 0 ? `Add ${quantity} to cart` : 'Add to cart'}
            </button>
          </div>
        ) : (
          <button disabled className="w-full bg-muted text-muted-foreground font-semibold py-2 rounded-lg cursor-not-allowed">
            Out of stock
          </button>
        )}
      </div>
    </div>
  )
}
