'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '@/lib/context'

interface DemoUser {
  email: string
  password: string
  name: string
}

const DEMO_USERS: DemoUser[] = [
  { email: 'user@example.com', password: 'password123', name: 'John Doe' },
  { email: 'test@example.com', password: 'test123', name: 'Jane Smith' },
]

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const demoUser = DEMO_USERS.find((u) => u.email === email && u.password === password)

      if (demoUser) {
        const user = {
          id: `user-${Date.now()}`,
          email: demoUser.email,
          name: demoUser.name,
          phone: '+1-555-0100',
          addresses: [
            {
              id: 'addr-1',
              label: 'Home',
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              coordinates: { lat: 40.7128, lng: -74.006 },
              isDefault: true,
            },
          ],
          savedPaymentMethods: [
            {
              id: 'pm-1',
              type: 'card' as const,
              last4: '4242',
              isDefault: true,
            },
          ],
          loyaltyPoints: 450,
          referralCode: 'JOHN2024',
          createdAt: new Date(),
        }
        setUser(user)
        router.push('/app')
      } else {
        setError('Invalid email or password. Try user@example.com / password123')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoUser: DemoUser) => {
    setEmail(demoUser.email)
    setPassword(demoUser.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🛒</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">Welcome to GrocerGo</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Users */}
        <div className="space-y-3">
          <p className="text-sm text-center text-muted-foreground">Demo Accounts:</p>
          {DEMO_USERS.map((user) => (
            <button
              key={user.email}
              onClick={() => handleDemoLogin(user)}
              className="w-full p-3 text-left border border-border rounded-lg hover:bg-secondary/50 transition-colors text-sm"
            >
              <div className="font-medium text-foreground">{user.email}</div>
              <div className="text-xs text-muted-foreground">Password: {user.password}</div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
          <Link href="/splash" className="text-primary font-semibold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
