'use client'

import { AppLayout } from '@/components/app-layout'
import { Tag, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const coupons = [
  {
    id: '1',
    code: 'FRESH20',
    description: 'Get 20% off on fresh produce',
    discount: '20%',
    minOrder: 50,
    expiryDate: '2026-12-31',
    used: false,
  },
  {
    id: '2',
    code: 'WELCOME10',
    description: 'First order discount - 10% off',
    discount: '10%',
    minOrder: 25,
    expiryDate: '2026-12-31',
    used: true,
  },
  {
    id: '3',
    code: 'DAIRY15',
    description: 'Get 15% off on all dairy products',
    discount: '15%',
    minOrder: 35,
    expiryDate: '2026-11-30',
    used: false,
  },
  {
    id: '4',
    code: 'MEGA25',
    description: 'Mega sale! 25% off on selected items',
    discount: '25%',
    minOrder: 75,
    expiryDate: '2026-09-30',
    used: false,
  },
  {
    id: '5',
    code: 'SAVE50',
    description: '$5 off on orders above $50',
    discount: '$5',
    minOrder: 50,
    expiryDate: '2026-10-15',
    used: false,
  },
  {
    id: '6',
    code: 'LOYALTY100',
    description: 'Loyalty member exclusive - 30% off',
    discount: '30%',
    minOrder: 100,
    expiryDate: '2026-12-31',
    used: false,
  },
]

export default function CouponsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const activeCoupons = coupons.filter((c) => !c.used)

  return (
    <AppLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Tag className="w-8 h-8 text-accent" />
            Available Coupons & Offers
          </h1>
          <p className="text-muted-foreground">Save more with our exclusive deals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-accent">{activeCoupons.length}</p>
            <p className="text-sm text-muted-foreground">Active Offers</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-primary">UP TO 30%</p>
            <p className="text-sm text-muted-foreground">Maximum Discount</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-accent">{coupons.length}</p>
            <p className="text-sm text-muted-foreground">Total Offers</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Active', 'Used', 'Expiring Soon'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 rounded-full whitespace-nowrap font-medium border border-border hover:bg-secondary transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Coupons Grid */}
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`border rounded-lg p-6 transition-all ${
                coupon.used ? 'bg-muted/50 border-border opacity-60' : 'bg-card border-border hover:shadow-lg'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Coupon Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl font-bold text-accent">{coupon.discount}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{coupon.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Min order: ${coupon.minOrder} • Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Code Display */}
                  <div className="bg-background/50 border border-border rounded-lg p-3 inline-block">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Use code</p>
                    <p className="font-mono font-bold text-lg">{coupon.code}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:min-w-32">
                  {coupon.used ? (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-muted rounded-lg text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Used
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-all ${
                          copied === coupon.code
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-primary text-primary-foreground hover:opacity-90'
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                        {copied === coupon.code ? 'Copied!' : 'Copy Code'}
                      </button>
                      <button className="py-2 px-4 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">
                        Apply
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to Use */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg">How to Use Coupons</h3>
          <ol className="space-y-2 text-sm">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <span>Copy the coupon code by clicking the copy button</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <span>Add items to your cart and proceed to checkout</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <span>Paste the code in the &ldquo;Apply Coupon&rdquo; field</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <span>Your discount will be automatically applied</span>
            </li>
          </ol>
        </div>

        {/* Terms */}
        <div className="text-xs text-muted-foreground">
          <p className="mb-2 font-semibold">Terms & Conditions:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Each coupon can be used once per customer</li>
            <li>Coupons cannot be combined with other offers</li>
            <li>Expired coupons cannot be used</li>
            <li>Minimum order value must be met to apply coupon</li>
            <li>Subject to terms and conditions of use</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  )
}
