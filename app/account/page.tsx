'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { LogOut, Edit2, Plus, Trash2, MapPin } from 'lucide-react'
import { User } from '@/lib/types'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState('')
  const [editedName, setEditedName] = useState('')

  useEffect(() => {
    // Get user from sessionStorage
    const storedUser = sessionStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      const parsedUser = JSON.parse(storedUser)
      setEditedName(parsedUser.name)
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser')
    router.push('/login')
  }

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { ...user, name: editedName }
      setUser(updatedUser)
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setIsEditingProfile(false)
    }
  }

  const handleAddAddress = () => {
    if (user && newAddress.trim()) {
      const updatedUser = {
        ...user,
        addresses: [...user.addresses, newAddress],
      }
      setUser(updatedUser)
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setNewAddress('')
      setIsAddingAddress(false)
    }
  }

  const handleDeleteAddress = (index: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        addresses: user.addresses.filter((_, i) => i !== index),
      }
      setUser(updatedUser)
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser))
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Header cartCount={0} onCartClick={() => {}} />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={0} onCartClick={() => {}} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Account</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <Edit2 className="w-4 h-4" />
              {isEditingProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingProfile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={user.phone}
                    disabled
                    className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-foreground">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-foreground">{user.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                <p className="text-lg font-semibold text-foreground">{user.phone || 'Not added'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Addresses Section */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Delivery Addresses</h2>
            {!isAddingAddress && (
              <button
                onClick={() => setIsAddingAddress(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Address
              </button>
            )}
          </div>

          {isAddingAddress && (
            <div className="mb-6 p-4 bg-background rounded-lg border border-border">
              <div className="space-y-3">
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter complete address..."
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddAddress}
                    className="flex-1 bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingAddress(false)
                      setNewAddress('')
                    }}
                    className="flex-1 bg-secondary text-foreground font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {user.addresses.length > 0 ? (
            <div className="space-y-3">
              {user.addresses.map((address, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{address}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {index === 0 ? 'Default address' : 'Secondary address'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(index)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No delivery addresses added yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="bg-primary text-primary-foreground font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity text-center"
          >
            View Orders
          </Link>
          <Link
            href="/"
            className="bg-secondary text-foreground font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
