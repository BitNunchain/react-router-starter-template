'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, Mail, CreditCard, Wallet, Shield, Bell } from 'lucide-react'
import Link from 'next/link'

// Simple toast notification system
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Create toast element
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`
  toast.textContent = message
  
  // Add to document
  document.body.appendChild(toast)
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300)
  }, 3000)
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    walletAddress: '',
    subscriptionStatus: 'none',
    totalSpent: 0
  })

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile || {
          fullName: session?.user?.name || '',
          email: session?.user?.email || '',
          walletAddress: '',
          subscriptionStatus: 'none',
          totalSpent: 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const updateProfile = async (updates: Partial<typeof profile>) => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        showToast('Profile updated successfully!')
      } else {
        showToast('Failed to update profile', 'error')
      }
    } catch (error) {
      showToast('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      fullName: profile.fullName,
      walletAddress: profile.walletAddress
    })
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <p className="text-center text-gray-500">Please sign in to view your profile</p>
            <div className="mt-4 text-center">
              <Link href="/auth/signin" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <p className="text-gray-600 mt-1">
                Update your personal details and preferences
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={profile.fullName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                
                <div>
                  <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 mb-1">
                    Wallet Address
                  </label>
                  <input
                    id="wallet"
                    type="text"
                    value={profile.walletAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({ ...prev, walletAddress: e.target.value }))}
                    placeholder="0x... (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>

          {/* Account Status */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Status
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Subscription</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    profile.subscriptionStatus === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.subscriptionStatus === 'active' ? 'Active' : 'Free Plan'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Total Spent</span>
                  <span className="font-semibold">${profile.totalSpent.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing & Payments
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </button>
                
                <button className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Wallet className="h-4 w-4 mr-2" />
                  Crypto Wallet
                </button>
                
                <button className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Advantage Notice */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                🚀 BITNUN Competitive Advantage
              </h3>
              <p className="text-blue-700 mb-4">
                You're saving 70-95% compared to traditional platforms!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-900">Smart Contract Audits</div>
                  <div className="text-blue-700">$99 vs $2,000+ elsewhere</div>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-900">DeFi Development</div>
                  <div className="text-blue-700">$299 vs $5,000+ elsewhere</div>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-900">Enterprise Solutions</div>
                  <div className="text-blue-700">$999 vs $15,000+ elsewhere</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}