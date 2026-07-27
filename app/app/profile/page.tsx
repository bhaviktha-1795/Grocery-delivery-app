'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { useApp } from '@/lib/context'
import { User, MapPin, Gift, Settings, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useApp()
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'preferences'>('profile')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!user) return null

  return (
    <AppLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-1">{user.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase">Loyalty Points</p>
              <p className="text-3xl font-bold text-accent">{user.loyaltyPoints}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-6">
            {(['profile', 'addresses', 'preferences'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-semibold border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Full Name</label>
                      <p className="text-foreground font-semibold">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Email Address</label>
                      <p className="text-foreground font-semibold">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Phone Number</label>
                      <p className="text-foreground font-semibold">{user.phone}</p>
                    </div>
                    <button className="w-full py-2 px-4 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* Account Statistics */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold">Account Statistics</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="text-muted-foreground">Referral Code</span>
                      <span className="font-mono font-semibold">{user.referralCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Loyalty Points</span>
                      <span className="font-semibold text-accent">{user.loyaltyPoints}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </h3>

                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary transition-colors text-left">
                    <span>Change Password</span>
                    <span className="text-muted-foreground">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary transition-colors text-left">
                    <span>Two-Factor Authentication</span>
                    <span className="text-muted-foreground">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary transition-colors text-left">
                    <span>Privacy Settings</span>
                    <span className="text-muted-foreground">→</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold">{addr.label}</p>
                        {addr.isDefault && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border border-border rounded text-sm hover:bg-secondary transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 border border-destructive/20 text-destructive rounded text-sm hover:bg-destructive/10 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-foreground mb-1">{addr.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                </div>
              ))}

              <button className="w-full py-3 border-2 border-dashed border-primary rounded-lg font-semibold text-primary hover:bg-primary/5 transition-colors">
                Add New Address
              </button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Notification Preferences
                </h3>

                <div className="space-y-3">
                  {[
                    { label: 'Order Updates', desc: 'Get notified about your orders' },
                    { label: 'Promotions', desc: 'Receive special offers and coupons' },
                    { label: 'New Products', desc: 'Be notified about new products' },
                    { label: 'Email Digests', desc: 'Weekly summary emails' },
                  ].map((pref) => (
                    <label key={pref.label} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{pref.label}</p>
                        <p className="text-xs text-muted-foreground">{pref.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Referral Program
                </h3>

                <p className="text-sm text-muted-foreground">
                  Earn rewards by referring friends to GrocerGo. Each successful referral gets you bonus points!
                </p>

                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={user.referralCode}
                      readOnly
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground font-mono text-sm"
                    />
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90">
                      Copy
                    </button>
                  </div>
                </div>

                <button className="w-full py-2 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">
                  Share with Friends
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
