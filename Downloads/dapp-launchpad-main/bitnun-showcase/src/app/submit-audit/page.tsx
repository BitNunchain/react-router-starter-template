'use client'

import { useState } from 'react'
import { Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Simple toast notification system
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast)
    }, 300)
  }, 3000)
}

export default function SubmitAuditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectName: '',
    contractAddress: '',
    githubRepo: '',
    auditType: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // No authentication required - proceed with submission

    if (!formData.projectName || !formData.auditType) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    setLoading(true)
    
    try {
      // Simple redirect to payment for now
      router.push('/payment')
    } catch (error) {
      showToast('Failed to submit audit', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit Smart Contract Audit</h1>
          <p className="text-gray-600">
            Get professional security audit at 95% less cost than traditional firms
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Audit Request Form
            </h3>
            <p className="text-gray-600 mt-1">
              Provide details about your smart contract for security review
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={formData.projectName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="Enter your project name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="auditType" className="block text-sm font-medium text-gray-700 mb-1">
                  Audit Type *
                </label>
                <select 
                  value={formData.auditType} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, auditType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select audit type</option>
                  <option value="basic">Basic Audit - $99</option>
                  <option value="professional">Professional Audit - $299</option>
                  <option value="enterprise">Enterprise Audit - $999</option>
                </select>
              </div>

              <div>
                <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Address
                </label>
                <input
                  id="contractAddress"
                  type="text"
                  value={formData.contractAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, contractAddress: e.target.value }))}
                  placeholder="0x... (if deployed)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project, key features, and any specific concerns..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !formData.projectName || !formData.auditType}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Audit Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Competitive Advantage */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                💰 Huge Savings
              </h3>
              <p className="text-blue-700 mb-4">
                Save 95% compared to traditional audit firms
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-900">Basic Audit</div>
                  <div className="text-blue-700">$99 vs $2,000+ elsewhere</div>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-900">Professional</div>
                  <div className="text-blue-700">$299 vs $5,000+ elsewhere</div>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <div className="font-semibold text-blue-900">Enterprise</div>
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