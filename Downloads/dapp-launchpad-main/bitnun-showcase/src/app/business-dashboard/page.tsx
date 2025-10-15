'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, DollarSign, TrendingUp, Users, Zap, Target, BarChart3, PieChart } from 'lucide-react'
import Link from 'next/link'

export default function BusinessDashboard() {
  const [timeframe, setTimeframe] = useState('monthly')

  const revenueStreams = [
    {
      name: 'Premium Launchpad',
      current: 156000,
      target: 200000,
      growth: '+24%',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      name: 'NFT Creator Suite', 
      current: 89000,
      target: 100000,
      growth: '+18%',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      name: 'DeFi Protocols',
      current: 234000,
      target: 300000,
      growth: '+31%',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      name: 'Smart Contract Audits',
      current: 67000,
      target: 80000,
      growth: '+12%',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    }
  ]

  const projectTypes = [
    { name: 'DeFi Protocols', count: 47, revenue: 892000, avgPrice: 18978 },
    { name: 'NFT Collections', count: 189, revenue: 234500, avgPrice: 1241 },
    { name: 'Token Launches', count: 76, revenue: 456700, avgPrice: 6009 },
    { name: 'dApp Platforms', count: 23, revenue: 167800, avgPrice: 7295 }
  ]

  const clientMetrics = [
    { metric: 'Total Active Clients', value: '2,847', change: '+156 this month', positive: true },
    { metric: 'Premium Subscribers', value: '468', change: '+89 this month', positive: true },
    { metric: 'Enterprise Contracts', value: '23', change: '+5 this month', positive: true },
    { metric: 'Churn Rate', value: '2.3%', change: '-0.8% improvement', positive: true }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <BarChart3 className="text-green-400" size={24} />
            <h1 className="text-2xl font-bold">Business Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Revenue Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold">Revenue Dashboard</h2>
            <div className="flex space-x-2">
              {['weekly', 'monthly', 'yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    timeframe === period 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-2xl border border-green-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-300">Total Revenue</h3>
                <DollarSign className="text-green-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">$546K</div>
              <div className="text-green-400 text-sm">+23% from last month</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl border border-blue-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-300">Projects Launched</h3>
                <Target className="text-blue-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">335</div>
              <div className="text-blue-400 text-sm">+67 this month</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border border-purple-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-300">Active Users</h3>
                <Users className="text-purple-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">12.4K</div>
              <div className="text-purple-400 text-sm">+1.2K this month</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-6 rounded-2xl border border-orange-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-300">Conversion Rate</h3>
                <TrendingUp className="text-orange-400" size={20} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">8.7%</div>
              <div className="text-orange-400 text-sm">+1.3% improvement</div>
            </motion.div>
          </div>

          {/* Revenue Streams */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-2xl font-bold mb-6">Revenue by Service</h3>
              <div className="space-y-4">
                {revenueStreams.map((stream, index) => (
                  <div key={stream.name} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{stream.name}</div>
                      <div className="text-sm text-gray-400">${stream.current.toLocaleString()} / ${stream.target.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${stream.color}`}>${stream.current.toLocaleString()}</div>
                      <div className="text-green-400 text-sm">{stream.growth}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-2xl font-bold mb-6">Project Types Performance</h3>
              <div className="space-y-4">
                {projectTypes.map((type, index) => (
                  <div key={type.name} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{type.name}</div>
                      <div className="text-sm text-gray-400">{type.count} projects</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">${type.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Avg: ${type.avgPrice}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Client Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-12"
          >
            <h3 className="text-2xl font-bold mb-6">Client Metrics</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {clientMetrics.map((metric, index) => (
                <div key={metric.metric} className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-sm text-gray-400 mb-2">{metric.metric}</div>
                  <div className={`text-sm ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Growth Projections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6">Growth Projections</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">$3M+</div>
                  <div className="text-white font-semibold">Year 1 Target</div>
                  <div className="text-gray-400 text-sm">Conservative estimate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-400 mb-2">$10M+</div>
                  <div className="text-white font-semibold">Year 2 Target</div>
                  <div className="text-gray-400 text-sm">Aggressive growth</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-400 mb-2">$50M+</div>
                  <div className="text-white font-semibold">Year 5 Vision</div>
                  <div className="text-gray-400 text-sm">Market leader</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12 grid md:grid-cols-4 gap-4"
          >
            <Link href="/launchpad" className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-semibold">Manage Launchpad</div>
            </Link>
            <Link href="/nft-creator" className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-semibold">NFT Dashboard</div>
            </Link>
            <Link href="/defi-generator" className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">💎</div>
              <div className="font-semibold">DeFi Analytics</div>
            </Link>
            <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg p-4 text-center transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Full Report</div>
            </button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}