'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/lib/context'
import { ShoppingCart, Home, Package, User, LogOut, MapPin, Search } from 'lucide-react'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, logout, cart } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/app" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white">🛒</span>
            </div>
            <span className="hidden sm:inline">GrocerGo</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/app"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/app/stores"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Stores
            </Link>
            <Link
              href="/app/orders"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Package className="w-4 h-4" />
              Orders
            </Link>
            <Link
              href="/app/profile"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <Link
              href="/app/cart"
              className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
            <Link href="/app" className="block px-4 py-2 hover:bg-secondary rounded-lg transition-colors text-sm">
              Home
            </Link>
            <Link href="/app/stores" className="block px-4 py-2 hover:bg-secondary rounded-lg transition-colors text-sm">
              Stores
            </Link>
            <Link href="/app/orders" className="block px-4 py-2 hover:bg-secondary rounded-lg transition-colors text-sm">
              Orders
            </Link>
            <Link href="/app/profile" className="block px-4 py-2 hover:bg-secondary rounded-lg transition-colors text-sm">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-secondary rounded-lg transition-colors text-sm text-destructive"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
