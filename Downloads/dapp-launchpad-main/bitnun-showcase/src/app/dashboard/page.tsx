'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  User, 
  CreditCard, 
  FileCheck, 
  GraduationCap, 
  Building2,
  Shield,
  GitBranch,
  Settings,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface DashboardData {
  orders: any[]
  auditProjects: any[]
  enrollments: any[]
  subscriptions: any[]
  totalSpent: number
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      loadDashboardData()
    } else if (status !== 'loading') {
      // If not loading and no session, set demo data
      setDashboardData({
        orders: [],
        auditProjects: [],
        enrollments: [],
        subscriptions: [],
        totalSpent: 0
      })
      setLoading(false)
    }
  }, [session, status])

  const loadDashboardData = async () => {
    setError(null)
    if (!session?.user?.id) return

    try {
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured - using demo data')
        setDashboardData({
          orders: [],
          auditProjects: [],
          enrollments: [],
          subscriptions: [],
          totalSpent: 0
        })
        setLoading(false)
        return
      }

      // Fetch user's orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      // Fetch audit projects
      const { data: auditProjects } = await supabase
        .from('audit_projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      // Fetch academy enrollments
      const { data: enrollments } = await supabase
        .from('academy_enrollments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('enrolled_at', { ascending: false })

      // Fetch subscriptions
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      const totalSpent = orders?.reduce((sum, order) => 
        order.status === 'paid' ? sum + order.amount : sum, 0) || 0

      setDashboardData({
        orders: orders || [],
        auditProjects: auditProjects || [],
        enrollments: enrollments || [],
        subscriptions: subscriptions || [],
        totalSpent
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Unable to load dashboard data. Using demo mode.')
      // Fall back to demo data on error
      setDashboardData({
        orders: [],
        auditProjects: [],
        enrollments: [],
        subscriptions: [],
        totalSpent: 0
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 max-w-md"
        >
          <User className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-gray-300 mb-6">
            OAuth providers are not configured. Set up Google or GitHub OAuth to enable authentication.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => signIn()}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Try Sign In
            </button>
            <div className="text-sm text-gray-400">
              or use{' '}
              <button
                onClick={() => window.location.href = '/'}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                demo dashboard
              </button>
              {' '}without authentication
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: CreditCard },
    { id: 'audits', label: 'Audits', icon: FileCheck },
    { id: 'academy', label: 'Academy', icon: GraduationCap },
    { id: 'services', label: 'Services', icon: Building2 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
      case 'active':
        return 'text-green-400'
      case 'pending':
      case 'processing':
        return 'text-yellow-400'
      case 'cancelled':
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
      case 'active':
        return <CheckCircle className="w-5 h-5" />
      case 'pending':
      case 'processing':
        return <Clock className="w-5 h-5" />
      case 'cancelled':
      case 'failed':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{session.user.name || session.user.email}</h1>
              <p className="text-gray-400">Welcome to your BITNUN dashboard</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && dashboardData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8 text-green-400" />
                      <span className="text-2xl font-bold text-white">${dashboardData.totalSpent.toLocaleString()}</span>
                    </div>
                    <h3 className="text-green-400 font-semibold">Total Spent</h3>
                    <p className="text-gray-400 text-sm">Lifetime investment</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <CreditCard className="w-8 h-8 text-blue-400" />
                      <span className="text-2xl font-bold text-white">{dashboardData.orders.length}</span>
                    </div>
                    <h3 className="text-blue-400 font-semibold">Total Orders</h3>
                    <p className="text-gray-400 text-sm">All services purchased</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <FileCheck className="w-8 h-8 text-purple-400" />
                      <span className="text-2xl font-bold text-white">{dashboardData.auditProjects.length}</span>
                    </div>
                    <h3 className="text-purple-400 font-semibold">Audits</h3>
                    <p className="text-gray-400 text-sm">Security assessments</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <GraduationCap className="w-8 h-8 text-orange-400" />
                      <span className="text-2xl font-bold text-white">{dashboardData.enrollments.length}</span>
                    </div>
                    <h3 className="text-orange-400 font-semibold">Courses</h3>
                    <p className="text-gray-400 text-sm">Academy enrollments</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {dashboardData.orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="text-white font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-gray-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">${order.amount}</p>
                          <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && dashboardData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left text-gray-300 pb-4">Order ID</th>
                        <th className="text-left text-gray-300 pb-4">Service</th>
                        <th className="text-left text-gray-300 pb-4">Amount</th>
                        <th className="text-left text-gray-300 pb-4">Status</th>
                        <th className="text-left text-gray-300 pb-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-700 last:border-b-0">
                          <td className="py-4 text-white font-mono text-sm">
                            {order.id.slice(0, 8)}...
                          </td>
                          <td className="py-4 text-gray-300">{order.service_id}</td>
                          <td className="py-4 text-white font-semibold">${order.amount}</td>
                          <td className={`py-4 font-medium ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </td>
                          <td className="py-4 text-gray-400">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Audits Tab */}
            {activeTab === 'audits' && dashboardData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {dashboardData.auditProjects.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700">
                    <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Audits Yet</h3>
                    <p className="text-gray-400 mb-6">Order your first smart contract audit to get started</p>
                    <a 
                      href="/audits" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                    >
                      Order Audit
                    </a>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {dashboardData.auditProjects.map((project) => (
                      <div key={project.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white">{project.project_name}</h3>
                          <div className={`flex items-center space-x-2 ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            <span className="font-medium">{project.status.toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Audit Type</p>
                            <p className="text-white capitalize">{project.audit_type}</p>
                          </div>
                          {project.contract_address && (
                            <div>
                              <p className="text-gray-400 text-sm mb-1">Contract Address</p>
                              <p className="text-white font-mono text-sm">{project.contract_address}</p>
                            </div>
                          )}
                        </div>
                        {project.report_url && (
                          <div className="mt-4">
                            <a 
                              href={project.report_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                              Download Report
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}