'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SplashPage() {
  const router = useRouter()
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-primary via-background to-secondary transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-8 px-6 max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🛒</span>
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GrocerGo
          </h1>
          <p className="text-lg text-muted-foreground font-medium">Fresh Groceries, Fast Delivery</p>
        </div>

        {/* Tagline */}
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Order fresh groceries from your favorite stores and get them delivered in minutes
        </p>

        {/* Loading Animation */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Quick Links */}
        <div className={`pt-4 space-y-3 transition-opacity duration-1000 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <Link
            href="/login"
            className="block w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="block w-full py-3 px-6 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity border border-border"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
