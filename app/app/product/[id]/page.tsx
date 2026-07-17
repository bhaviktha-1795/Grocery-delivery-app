'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/app-layout'
import { mockProducts } from '@/lib/mock-data'
import { useApp } from '@/lib/context'
import { Star, ShoppingCart, ChevronLeft, Minus, Plus } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { addToCart } = useApp()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  
  const { id } = use(params)
  const product = mockProducts.find((p) => p.id === id)

  if (!product) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Product not found</p>
          <Link href="/app" className="text-primary font-semibold hover:underline mt-2">
            Back to home
          </Link>
        </div>
      </AppLayout>
    )
  }

  const handleAddToCart = () => {
    console.log('[v0] Adding to cart:', product.name, 'Quantity:', quantity)
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const relatedProducts = mockProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4)

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden border border-border">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.discount && (
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full font-semibold">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">{product.brand}</p>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-muted'}`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{product.rating}</span>
              </div>
              <p className="text-sm text-muted-foreground">({product.reviewCount} reviews)</p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
              {product.discount && (
                <p className="text-sm text-accent font-semibold">Save ${(product.originalPrice! - product.price).toFixed(2)}</p>
              )}
            </div>

            {/* Stock Status */}
            <div className="inline-block">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.inStock ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold min-w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                added
                  ? 'bg-primary/20 text-primary'
                  : product.inStock
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            {/* Additional Info */}
            <div className="space-y-3 pt-4 border-t border-border">
              {product.unit && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unit</span>
                  <span className="font-semibold">{product.unit}</span>
                </div>
              )}
              {product.nutritionInfo && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nutrition</span>
                  <span className="font-semibold">{product.nutritionInfo}</span>
                </div>
              )}
              {product.expiryDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expiry</span>
                  <span className="font-semibold">{product.expiryDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/app/product/${p.id}`}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full aspect-square bg-muted overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    {p.discount && (
                      <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                        -{p.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold">${p.price}</p>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          addToCart(p, 1)
                        }}
                        className="p-1 bg-primary text-primary-foreground rounded hover:opacity-90"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  )
}
